import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.*;

import acm.io.IODialog;



public class BreakoutServer implements BreakoutConstants{
	public static final int MIN_PEOPLE_IN_GAME = 2;

	public static Hashtable<String, PrintWriter> clientSocketWriterMap = new Hashtable<String, PrintWriter>();
	public static Hashtable<String, Integer> scoreBoard = new Hashtable<String, Integer>();
	public static String[][] bricks = new String[NBRICK_ROWS][NBRICKS_PER_ROW];
	public static int GAME_STATUS = GAME_STATUS_WAITING;

	private static class ClientHandler extends Thread {
		private Socket clientSocket;
		private PrintWriter out;
		private BufferedReader in;
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
		        		String clientName = st.nextToken();
	        			if(!clientSocketWriterMap.containsKey(clientName)){
	        				clientSocketWriterMap.put(clientName, out);
	        				scoreBoard.put(clientName, 0);
	        				if(GAME_STATUS == GAME_STATUS_WAITING && clientSocketWriterMap.size() >= MIN_PEOPLE_IN_GAME){
	        					GAME_STATUS = GAME_STATUS_STARTED;
	        					broadcast("/start", null);
	        				}else if(GAME_STATUS == GAME_STATUS_STARTED){
	        					String update = "update";
	        					sendMsg(update);
	        				}else{
	        					GAME_STATUS = GAME_STATUS_WAITING;
	        					//System.out.println("Waiting for at least " + (MIN_PEOPLE_IN_GAME - clientSocketWriterMap.size()) + "more people to join the game.");
	        				}
        					//System.out.println( clientSocketWriterMap.size() + " people in the game");
	        			}else{
	        				/*handle the problem where an existing client using the same name*/
	        			}
		        	}else if(command.startsWith("/remove")){
		        		String x = st.nextToken();
		        		String y = st.nextToken();
		        		String userName = st.nextToken();
		        		ArrayList<String> exceptList = new ArrayList<String>();
		        		exceptList.add(userName);
		        		broadcast(inputLine, exceptList);
		        		scoreBoard.put(userName, scoreBoard.get(userName) + 1);
		        		String scoreUpdate = convertScoreBoradtoJSON();
		        		System.out.println(userName + " remove the brick at ("+ x +", "+ y +") " );
		        		System.out.println("Updated score: " + scoreUpdate);
		        		broadcast(scoreUpdate, null);
		        	}
		        }
			}catch(IOException e){
				System.err.println(e);
			}

		}

		public String convertScoreBoradtoJSON(){
			String scoreUpdate = "/score";
			Iterator<Map.Entry<String, Integer>> it = scoreBoard.entrySet().iterator();
			while(it.hasNext()){
				Map.Entry<String, Integer> pairs = (Map.Entry<String, Integer>) it.next();
				scoreUpdate += " " + pairs.getKey()+":"+pairs.getValue();
			}
			return scoreUpdate;
		}
		public void broadcast(String msg, ArrayList<String> exceptList){
			//System.out.println("broadcasting ... " + msg);
			Iterator<Map.Entry<String, PrintWriter>> it = clientSocketWriterMap.entrySet().iterator();
			while(it.hasNext()){
				Map.Entry<String, PrintWriter> pairs = (Map.Entry<String, PrintWriter>) it.next();
				String name = (String)pairs.getKey();
				PrintWriter clientOut = (PrintWriter) pairs.getValue();
				if(exceptList!=null && exceptList.contains(name)){
					//System.out.println("Skip sending message to " + name);
					continue;
				}
				clientOut.println(msg);
				//System.out.println("Sending message to ... " + (String) pairs.getKey());
			}
		}
		
		public void sendMsg(String msg){
			out.println(msg);
		}
	}
	
	public static void main(String[] args) throws Exception {
		
		ServerSocket serverSocket = new ServerSocket(PORT);
		System.out.println("The breakout server is running.");
		
		try {
			while (true){
				new ClientHandler(serverSocket.accept()).start();
			}
		} catch (IOException e) {
			System.err.println(e);
		} finally{
			serverSocket.close();
		}

	}
}
