import java.io.*;
import java.net.*;

import acm.program.*;

public class EchoServer extends ConsoleProgram implements EchoConstants{
	public void run() {
		try {
			ServerSocket ss = new ServerSocket(12345);
			Socket s = ss.accept();
			
			//get the input in byte stream
			InputStream in = s.getInputStream();
			//tranlate byte stream into character stream then into String stream
			BufferedReader inbr = new BufferedReader(new InputStreamReader(in));
			PrintWriter outpw = new PrintWriter(new OutputStreamWriter(s.getOutputStream()));

			String inputLine = inbr.readLine();
			while(inputLine != null){
				//Echo it back 
				outpw.println(inputLine);
				outpw.flush();
				inputLine = inbr.readLine();
			}
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
