// TODO: comment this program

import acm.graphics.*;
import acm.program.*;
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
public class Sunset extends GraphicsProgram {
	
	private static final int SUN_SIZE = 40;
	
	public void run() {
		GOval sun = drawScene();
		animate(sun);
	}

	private void animate(GOval sun) {
		while(true) {
			sun.move(0, 1);
			pause(50);
		}
	}
	
	private void drawTree(int xMid) {
		int trunkWidth = 20;
		int trunkHeight = 40;
		int leafWidth = 40;
		
		int trunkTop = getHeight()/2 - trunkHeight;
		
		GRect trunk = new GRect(xMid - trunkWidth / 2, trunkTop, trunkWidth, trunkHeight);
		trunk.setColor(Color.ORANGE);
		trunk.setFilled(true);
		add(trunk);
		
		GOval leaf = new GOval(xMid - leafWidth / 2, trunkTop - leafWidth / 2, leafWidth, leafWidth);
		leaf.setColor(Color.GREEN);
		leaf.setFilled(true);
		add(leaf);
	}

	private GOval drawScene() {
		GRect sky = new GRect(0, 0, getWidth(), getHeight());
		sky.setColor(Color.BLUE);
		sky.setFilled(true);
		add(sky);
		
		int y = getHeight() / 4;
		GOval sun = new GOval((getWidth() - SUN_SIZE) / 2, y - SUN_SIZE / 2, SUN_SIZE, SUN_SIZE);
		sun.setColor(Color.YELLOW);
		sun.setFilled(true);
		add(sun);
		
		GRect ground = new GRect(0, getHeight() / 2, getWidth(), getHeight() / 2);
		ground.setColor(Color.GREEN);
		ground.setFilled(true);
		add(ground);
		
		drawTrees();
		
		return sun;
	}

	private void drawTrees() {
		for(int i = 0; i < 10; i++) {
			int x = i * 100 + 30;
			drawTree(x);
		}
	}
	
	
}
