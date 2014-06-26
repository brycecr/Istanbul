import java.io.*;
import java.net.*;

import acm.program.*;

/**
TY's Echo Server: repeat whatever Julia sends to me, except those sentences start with "I am".

Note: When executing, make sure you run the server before the client. 
(Otherwise, there will be no one there waiting to serve the client. :-))

**/
public class EchoServer extends ConsoleProgram implements EchoConstants{
	public void run() {
		try {
            //Have a little minion listening to port 12345
            ServerSocket ss = new ServerSocket(12345);
            //accepting the request, and have another minion handling the input and output for this connection.
            Socket socketToJulia = ss.accept();
            
            //Define the helper who will translate the input "byte" stream into "character" stream, then into "String" stream  
            BufferedReader in = new BufferedReader(new InputStreamReader(socketToJulia.getInputStream()));
            //Define the helper who will translate the output from "String" stream into "character" stream, then into "Byte" stream
            PrintWriter out = new PrintWriter(new OutputStreamWriter(socketToJulia.getOutputStream()));

            while( true ){
                //Read a line of String from the socket through the helper
                String s = in.readLine(); 
                if( s == null){
                    //Connection is terminated
                    break;
                }
                println("Julia says:" + s);
                
                //Decide the output string.
                //If the string starts with "I am", we are changing it into "You are".
                String output;
                output = s;
                if(s.contains("I am")){
                    output = "You are" + s.substring(4);
                }
                
				//Send it out to the client, the helper will translate the string into a stream of bytes
                out.println(output);
                //Flush it out into the Internet
                out.flush();
            }

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
