import java.io.*;
import java.net.*;

import acm.program.*;

/**
Julia's Echo Client: send messages to TY's Echo Server, and receive TY's message.

Note: When executing, make sure you run the server before the client. 
(Otherwise, there will be no one there waiting to serve the client. :-))
**/
public class EchoClient extends ConsoleProgram implements EchoConstants{

	public void run() {
		try {
			//Create a connection request to TY's Echo Server, which listens at "127.0.0.1" on port 12345.
			//The IP address "127.0.0.1" is a special address, referring to the local machine itself.
			//If you run the Echo Server on the same machine, keep the address as "127.0.0.1".
			//Otherwise, change the IP address to the Echo Server's IP address.
			Socket s = new Socket("127.0.0.1", 12345);
			
			
            //Define the helper who will translate the output from "String" stream into "character" stream, then into "Byte" stream
			PrintWriter outpw = new PrintWriter(new OutputStreamWriter(s.getOutputStream()));
			//Define the helper who will translate the input "byte" stream into "character" stream, then into "String" stream
			BufferedReader inbr = new BufferedReader(new InputStreamReader(s.getInputStream()));
			
			while(true){
				//Get user's input
				String userInput = readLine("What do you want to tell TY?");
				if( userInput == null){
					break;
				}
				//Send it out to the server, the helper will translate the string into a stream of bytes
				outpw.println(userInput);
				//Flush it out to the Internet
				outpw.flush();
				
				//Read a line of String from the socket through the helper
				String echoedLine = inbr.readLine();
				println("TY says:" + echoedLine);
			}
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
