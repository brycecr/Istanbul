import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.*;

/**
2-Person Breakout - Server

The Protocol of the Game:
Messages from the Clients:
1. "/join <USERNAME>" tells the server that a user called USERNAME is joining the game.
2. "/remove <X> <Y> <USERNAME>" tells the server that the user USERNAME removed a brick at coordinate (X, Y)
Messages from the Server:
1. "/start" tells the clients that the game is now started.
2. "/score <USERNAME1>:<SCORE1> <USERNAME2>:<SCORE2>" tells the clients of the scores of each player

When executing, run the BreakoutServer before running the Breakout client.

**/

public class BreakoutServer implements BreakoutConstants{
	public static final int MIN_PEOPLE_IN_GAME = 2;

	//The PrintWriter (which helps translate a String into byte stream) for each client
	public static Hashtable<String, PrintWriter> clientSocketWriterMap = new Hashtable<String, PrintWriter>();
	//The Score Board. The key is username, and the value is the score.
	public static Hashtable<String, Integer> scoreBoard = new Hashtable<String, Integer>();

	//The handler for each incoming client connection request
	private static class ClientHandler extends Thread {
		private Socket clientSocket;
		private PrintWriter out;
		private BufferedReader in;
		
		//Constructor of the handler: initialize the byte stream helper for each client
		public ClientHandler(Socket s){
			clientSocket = s;
			try {
				out = new PrintWriter(clientSocket.getOutputStream(), true);
		        in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
			} catch (IOException e) {
				System.err.println(e);
			}
		}
		
		@Override
		public void run() {
			try{
		        String inputLine;
		        while ((inputLine = in.readLine()) != null) {
		        	StringTokenizer st = new StringTokenizer(inputLine);
		        	String command = st.nextToken();
		        	
		        	if(command.startsWith("/join")){
		        		//If a client sends the "/join" message, record the client's name and it's output helper
		        		String clientName = st.nextToken();
	        			if(!clientSocketWriterMap.containsKey(clientName)){
	        				clientSocketWriterMap.put(clientName, out);
	        				scoreBoard.put(clientName, 0);
	        				if(clientSocketWriterMap.size() >= MIN_PEOPLE_IN_GAME){
	        					//If there are more than 2 people joined the game
	        					//Tell every clients to start 
	        					broadcast("/start", null);
	        				}
	        			}
		        	}else if(command.startsWith("/remove")){
		        		//If a client removed a brick, let other players know.
		        		String x = st.nextToken();
		        		String y = st.nextToken();
		        		String userName = st.nextToken();
		        		ArrayList<String> exceptList = new ArrayList<String>();
		        		exceptList.add(userName);
		        		//Broadcast to everyone, except the one originally removed the brick
		        		broadcast(inputLine, exceptList);
		        		//update the score
		        		scoreBoard.put(userName, scoreBoard.get(userName) + 1);
		        		//Generate the score update message
		        		String scoreUpdate = convertScoreBoradtoJSON();
		        		System.out.println(userName + " remove the brick at ("+ x +", "+ y +") " );
		        		System.out.println("Updated score: " + scoreUpdate);
		        		//Send the score update to everyone
		        		broadcast(scoreUpdate, null);
		        	}
		        }
			}catch(IOException e){
				System.err.println(e);
			}

		}
		
		/*This function generates the score update message according to the records in the score board */
		public String convertScoreBoradtoJSON(){
			//Message's formate: "/score <USERNAME1>:<SCORE1> <USERNAME2>:<SCORE2>"
			String scoreUpdate = "/score";
			Iterator<Map.Entry<String, Integer>> it = scoreBoard.entrySet().iterator();
			while(it.hasNext()){
				Map.Entry<String, Integer> pairs = (Map.Entry<String, Integer>) it.next();
				scoreUpdate += " " + pairs.getKey()+":"+pairs.getValue();
			}
			return scoreUpdate;
		}
		
		/*This function send a message to every client, except the clients in the exceptList. */
		public void broadcast(String msg, ArrayList<String> exceptList){
			Iterator<Map.Entry<String, PrintWriter>> it = clientSocketWriterMap.entrySet().iterator();
			while(it.hasNext()){
				Map.Entry<String, PrintWriter> pairs = (Map.Entry<String, PrintWriter>) it.next();
				String name = (String)pairs.getKey();
				PrintWriter clientOut = (PrintWriter) pairs.getValue();
				if(exceptList!=null && exceptList.contains(name)){
					continue;
				}
				clientOut.println(msg);
			}
		}		
	}
	
	public static void main(String[] args) throws Exception {
		
		//The minion of server socket, waiting for connection request 
		ServerSocket serverSocket = new ServerSocket(PORT);
		System.out.println("The breakout server is running.");
		
		try {
			while (true){
				//For each incoming request, generate a Handler thread to handle the request.
				new ClientHandler(serverSocket.accept()).start();
			}
		} catch (IOException e) {
			System.err.println(e);
		} finally{
			serverSocket.close();
		}

	}
}
