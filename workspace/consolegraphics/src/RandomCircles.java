// TODO: comment this program

import acm.graphics.*;
import acm.program.*;
import acm.util.RandomGenerator;

import java.awt.*;

import sun.misc.Cleaner;

/**
 * Topics:
 * return variables
 * 
 * Old topics:
 * graphics
 * animations
 * loops
 */
public class RandomCircles extends GraphicsProgram {
	
	private static final int NUM_CIRCLES = 10;
	
	private RandomGenerator rgen = new RandomGenerator();
	
	public void run() {
		for(int i = 0; i < NUM_CIRCLES; i++) {
			drawRandomCircle();
		}
		
	}

	private void drawRandomCircle() {
		int size = rgen.nextInt(70, 180);
		int x = rgen.nextInt(0, getWidth() - size);
		int y = rgen.nextInt(0, getHeight() - size);
		Color c = rgen.nextColor();
		
		GOval a = new GOval(x, y, size, size);
		a.setColor(c);
		a.setFilled(true);
		add(a);

	}
}
