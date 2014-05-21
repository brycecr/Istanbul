// TODO: comment this program

import acm.graphics.*;     // GOval, GRect, etc.
import acm.program.*;      // GraphicsProgram
import acm.util.*;         // RandomGenerator
import java.applet.*;      // AudioClip
import java.awt.*;         // Color
import java.awt.event.*;   // MouseEvent

public class Breakout extends GraphicsProgram implements BreakoutConstants {
	
	public void run() {
		setSize(APPLICATION_WIDTH, APPLICATION_HEIGHT);
		
		drawBricks();
	}

	private void drawBricks() {
		GRect r = new GRect(5, 5, 20, 20);
		r.setFilled(true);
		add(r);
		
	}
	
}
