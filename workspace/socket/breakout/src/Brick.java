import acm.graphics.*;     // GOval, GRect, etc.
import acm.program.*;      // GraphicsProgram
import acm.util.*;         // RandomGenerator
import java.awt.*;         // Color
import java.awt.event.*;   // MouseEvent


public class Brick{
	public static int PRESENT = 1;
	public static int DESTROYED = 0;
	private int row;
	private int col;
	private int status;
	private GRect rect;
	public Brick(int r, int c, double w, double h){
		status = PRESENT;
		row = r;
		col = c;
		rect = new GRect(w, h);
	}
	public GRect getRect(){
		return rect;
	}
}
