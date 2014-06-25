import java.io.*;
import java.net.*;

import acm.program.*;

public class EchoClient extends ConsoleProgram implements EchoConstants{

	public void run() {
		try {
			Socket s = new Socket("localhost", 12345);
			
			String userInput = readLine("Your input:");
			OutputStream out = s.getOutputStream();
			/* tranlate string into byte stream */
			PrintWriter outpw = new PrintWriter(new OutputStreamWriter(out));
			// send it to the server
			while(userInput != null){
				outpw.println(userInput);
				outpw.flush();
				BufferedReader inbr = new BufferedReader(new InputStreamReader(s.getInputStream()));
				String echoedLine = inbr.readLine();
				println("Server echoed:" + echoedLine);
				userInput = readLine("Your input:");
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
