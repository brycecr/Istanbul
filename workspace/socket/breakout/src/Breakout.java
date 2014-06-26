// TODO: comment this program

import acm.graphics.*;     // GOval, GRect, etc.
import acm.io.IODialog;
import acm.program.*;      // GraphicsProgram
import acm.util.*;         // RandomGenerator

import java.applet.*;      // AudioClip
import java.awt.*;         // Color
import java.awt.event.*;   // MouseEvent
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.*;


/**
2-Person Breakout -- Client

The Protocol of the Game:
Messages from the Clients:
1. "/join <USERNAME>" tells the server that a user called USERNAME is joining the game.
2. "/remove <X> <Y> <USERNAME>" tells the server that the user USERNAME removed a brick at coordinate (X, Y)
Messages from the Server:
1. "/start" tells the clients that the game is now started.
2. "/score <USERNAME1>:<SCORE1> <USERNAME2>:<SCORE2>" tells the clients of the scores of each player

When executing, run the BreakoutServer before running the Breakout client.

**/

public class Breakout extends GraphicsProgram implements BreakoutConstants {
	int NUM_LIFE = 1000000;
	int game_status = GAME_STATUS_WAITING;
	String winner = "No one";
	GRect paddle = new GRect(PADDLE_WIDTH, PADDLE_HEIGHT);
	GOval ball = new GOval(2 * BALL_RADIUS, 2 * BALL_RADIUS);
	
	GLabel nameTag;
	GLabel winnerLabel = new GLabel(winner);
	GLabel leadingLabel = new GLabel(" is leading!");
	ArrayList<GLabel> scores = new ArrayList<GLabel>();
	String userName;
	String serverName;
	Socket breakoutSocket;
	BufferedReader in;
	
	public static ArrayList<String> msgQueue = new ArrayList<String>();

	public void run() {
		setUp();
		addMouseListeners();
		
		for(int i = 0; i < NUM_LIFE; i++) {
			resetBall();
			playTurn();
		}
	}

	private void setUp() {
		//Get user's name and server's IP
		getUserInput();
		//Setup the connection with the Server
		establishConn();
		//Render the labels in the game world (ex: User's name, scores ... etc) 
		drawLabelsInTheWorld();
		//Render the bricks
		drawBricks();
		paddle.setFilled(true);
		add(paddle, 0, getHeight() - PADDLE_Y_OFFSET);
		ball.setFilled(true);
	}
	
	//This function is to render the labels in the game world
	private void drawLabelsInTheWorld(){
		//Render the label for user's name
		nameTag = new GLabel("Player " + userName);
		nameTag.scale(1.5);
		nameTag.setColor(Color.GREEN);
		add(nameTag, getWidth()/2 - nameTag.getWidth()/2, 20);
		//Render the label for the current leader
		leadingLabel.scale(1.5);
		add(leadingLabel, getWidth() - leadingLabel.getWidth(), nameTag.getHeight()*2);
		winnerLabel.scale(1.5);
		add(winnerLabel, getWidth() - leadingLabel.getWidth() - winnerLabel.getWidth(), nameTag.getHeight()*2);
	}

	private void resetBall() {
		double ballX = (getWidth() - ball.getWidth()) / 2;
		double ballY = (getHeight() - ball.getHeight()) / 2;
		add(ball, ballX, ballY);
	}
	
	//This function is to get user's input through IODialog
	private void getUserInput(){
		IODialog nameDialog = new IODialog();
		userName = nameDialog.readLine("Please Enter Your Name:");
		IODialog serverDialog = new IODialog();
		serverName = serverDialog.readLine("Please Enter the IP Address or Hostname of the Breakout Server:");
	}
	
	//This function is to establish connections between the client and the server
	private void establishConn(){
		
		try{
			//Send out the connection request through sockets
			breakoutSocket = new Socket(serverName, PORT);
			//Setup the helps to translate byte streams from the socket to "string" stream
			in = new BufferedReader(new InputStreamReader(breakoutSocket.getInputStream()));
		}catch(IOException e){
			IODialog errDialog = new IODialog();
			errDialog.showErrorMessage(e.getLocalizedMessage());
			System.exit(1);
		}
		pause(1000);
		
		//If the program progresses to this point, it means we have successfully connected to the game server
		String joinMsg = "/join " + userName;
		sendMsg(joinMsg);
		
		//Wait for the other player to join, until the server tells us to start (by sending us the "/start" message)
		String waitMsg = "Wait for the Other Player to Join ... ";
		GLabel waitScreen = new GLabel(waitMsg);
		waitScreen.scale(1.5);
		waitScreen.setFont("Helvetica Bold");
		add(waitScreen, getWidth()/2 - waitScreen.getWidth()/2, getHeight()/2);
		
		String recv;
		try {
			while ((recv = in.readLine()) != null) {
				if(recv.startsWith("/start")){
					//If the server tells us to start,
					//remove the wait screen
					remove(waitScreen);
					//count down from 3 to 1
					countDown();
					//launch a separate thread to handle the follow up communications with the server
					new commandHandler(in).start();
					break;
				}
				System.out.println("waiting for the start msg, received: " +  recv);
			}
		} catch (IOException e) {
			IODialog errDialog = new IODialog();
			errDialog.showErrorMessage(e.getLocalizedMessage());
			System.exit(1);
		}
		println("LET's GO!");
	}
	
	//This function is to count down from 3 to 1 before starting the game
	private void countDown(){
		for(int i = 3; i > 0; i--){
			String waitMsg = i + " ... ";
			GLabel waitScreen = new GLabel(waitMsg);
			waitScreen.setFont("Helvetica Bold");
			waitScreen.scale(5);
			waitScreen.setColor(Color.RED);
			add(waitScreen, getWidth()/2 - waitScreen.getWidth()/2, getHeight()/2);
			pause(1000);
			remove(waitScreen);
		}
	}
	
	//At the beginning of each turn, we will update the world based on the messages we received so far.
	//1. Remove bricks that the other player knocks off
	//2. Update the score labels
	private void updateWorld(){
		for(int i = 0; i< msgQueue.size() && game_status != GAME_STATUS_FINISH; i++){
			String inputLine = msgQueue.remove(0);
			if(inputLine != null){	        	
	        	//Analyze the message, separate them using " ".
	        	StringTokenizer st = new StringTokenizer(inputLine);
	        	String command = st.nextToken();
	        	if(command.contains("/remove")){
	        		//If it is a "remove" message, remove the brick at the corresponding (x, y)
	        		Double x = new Double(st.nextToken());
	        		Double y = new Double(st.nextToken());
	        		println("Removing Object at (" + x + ", " + y + ")");
	        		GObject colliding = getElementAt(x, y);
	        		if(colliding != null){
		        		remove(colliding);
	        		}
	        	}else if(command.contains("/score")){
	        		//If it is a "score" message, update the score labels.
	        		
	        		//Remove the current score labels
	        		while(!scores.isEmpty()){
	        			remove(scores.remove(0));
	        		}
	        		int startX = 0;
	        		int totalScore = 0;
	        		int maxScore = 0;
	        		//Parsing the score message
	        		while(st.hasMoreTokens()){
	        			//Format: TY:2 
	        			String name_score = st.nextToken();
	        			StringTokenizer nsst = new StringTokenizer(name_score, ":");
	        			String name = nsst.nextToken();
	        			int score = Integer.parseInt(nsst.nextToken());
	        			totalScore += score;
	        			//Find out who is leading
	        			if(score > maxScore){
	        				winner = name;
	        				maxScore = score;
	        			}
	        			//If the total score from all users reaches the number of bricks, the games is finished.
	        			if(totalScore >= NBRICKS_PER_ROW * NBRICK_ROWS){
	        				game_status = GAME_STATUS_FINISH;
	        			}
	        			//Generate new score labels, and add them onto the game world.
	        			GLabel scoreLabel = new GLabel(name_score);
	        			scoreLabel.scale(1.5);
	        			scoreLabel.setColor(Color.DARK_GRAY);
	        			add(scoreLabel, startX, nameTag.getHeight()*2);
	        			startX += scoreLabel.getWidth() + 10;
	        			scores.add(scoreLabel);
	        		}
	        		//Update the leading labels depends on who is currently leading.
	        		if(!winnerLabel.getLabel().equals(winner)){
		        		remove(winnerLabel);
		        		winnerLabel.setLabel(winner);
		        		winnerLabel.scale(2);
		        		winnerLabel.setColor(Color.RED);
		        		add(winnerLabel, getWidth() - leadingLabel.getWidth() - winnerLabel.getWidth(), nameTag.getHeight()*2);
		        		pause(20);
		        		winnerLabel.scale(0.5);
		        		winnerLabel.setColor(Color.BLACK);
	        		}
	        	}
	        }
			//If the game is finished, show the user who is the winner!
			if(game_status == GAME_STATUS_FINISH){
				GLabel winnerIs = new GLabel("The Winner is ....");
				winnerIs.scale(3);
				add(winnerIs, (getWidth()-winnerIs.getWidth())/2, getHeight()/2 - winnerIs.getHeight());
				winnerLabel.scale(3);
				winnerLabel.setColor(Color.RED);
				add(winnerLabel, (getWidth()-winnerLabel.getWidth())/2, getHeight()/2);
				break;
			}
		}
	}
	
	//This function will help send the message to the server
	private void sendMsg(String msg){
		try{
			PrintWriter out = new PrintWriter(breakoutSocket.getOutputStream(), true);
			out.println(msg);
		}catch(IOException e){
			IODialog errDialog = new IODialog();
			errDialog.showErrorMessage(e.getLocalizedMessage());
		}
	}
	
	//This function will animate the ball movement.
	private void playTurn() {
		double dx = .5;
		double dy = .5;
		while(ball.getY() < getHeight()) {
			//At the beginning of each turn, update the world of the game on canvas.
			updateWorld();
			ball.move(dx, dy);

			double ballX = ball.getX();
			double ballY = ball.getY();
			if(ballX < 0 || ballX > getWidth() - BALL_RADIUS * 2) {
				dx *= -1;
			}
			
			if(ballY < 0) {
				dy *= -1;
			}

			
			GObject colliding = getCollidingObject();
			
			
			if(colliding == paddle) {
				dy = -Math.abs(dy);
			}else if(game_status != GAME_STATUS_FINISH && colliding != null && colliding != nameTag && colliding != winnerLabel && colliding != leadingLabel && !scores.contains(colliding)) {
				//If the ball is colliding with a brick, remove it.
				remove(colliding);
				//Also, send a message to the server.
				String msg ="/remove " + colliding.getX() + " " + colliding.getY() + " " + userName;
				sendMsg(msg);
				dy *= -1;
			}
			
			pause(DELAY);
		}
	}

	private GObject getCollidingObject() {
		double ballX = ball.getX();
		double ballY = ball.getY();
		double ballDiameter = 2 * BALL_RADIUS;
		if(getElementAt(ballX, ballY) != null) {
			return getElementAt(ballX, ballY);
		}
		if(getElementAt(ballX + ballDiameter, ballY) != null) {
			return getElementAt(ballX + ballDiameter, ballY);
		}
		if(getElementAt(ballX, ballY + ballDiameter) != null) {
			return getElementAt(ballX, ballY + ballDiameter);
		}
		if(getElementAt(ballX + ballDiameter, ballY + ballDiameter) != null) {
			return getElementAt(ballX + ballDiameter, ballY + ballDiameter);
		}
		return null;

	}

	private void drawBricks() {

		for(int i = 0; i < NBRICK_ROWS; i++) {
			for(int j = 0; j < NBRICKS_PER_ROW; j++) {
				double x = BRICK_SEP + j * (BRICK_WIDTH + BRICK_SEP);
				double y = BRICK_Y_OFFSET + i * (BRICK_HEIGHT + BRICK_SEP);
				GRect r = new GRect(BRICK_WIDTH, BRICK_HEIGHT);
				Color rectColor = getColor(i);
				r.setColor(rectColor);
				r.setFilled(true);
				add(r, x, y);
			}
		}


	}

	private Color getColor(int i) {
		if(i == 0 || i == 1) {
			return Color.RED;
		}
		if(i == 2 || i == 3) {
			return Color.ORANGE;
		}
		if(i == 4 || i == 5) {
			return Color.YELLOW;
		}
		if(i == 6 || i == 7) {
			return Color.GREEN;
		}
		return Color.CYAN;
	}

	public void mouseMoved(MouseEvent e) {
		double paddleX = e.getX() - paddle.getWidth() / 2;
		paddle.setLocation(paddleX, getHeight() - PADDLE_Y_OFFSET);
	}

	//This thread is started when the game is started.
	//It is used to listen the messages from the server, and put incoming messages into a queue.
	//These messages will be parsed at the beginning of each turn (see playTurn()).
	private static class commandHandler extends Thread {
		private BufferedReader input;
		public commandHandler(BufferedReader in){
			this.input = in;
		}
		public void run(){
			String inputLine;
			try {
				while ((inputLine = input.readLine()) != null) {
					synchronized(msgQueue){
						msgQueue.add(inputLine);
					}
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
