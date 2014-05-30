/*
 * File: Instakilo.java
 * ---------------------
 * Reference implementation (in progress) for Instakilo.
 */

import java.awt.event.ActionEvent;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTextField;

import acm.graphics.GImage;
import acm.graphics.GLabel;
import acm.program.GraphicsProgram;

public class Instakilo extends GraphicsProgram implements IKConstants {

	private HashMap<String, ArrayList<String>> data;
	private String currProfileName = null;
	private JTextField nameInput = new  JTextField();
	private JTextField newPhotoName = new JTextField();
	private FileSystem fileSystem = new FileSystem();
	private String filter = NO_FILTER;

	public void init() {
		data = fileSystem.loadMap(DATAFILE_NAME);
		addInteractors();
		showWelcomeMessage();
	}

	private void showWelcomeMessage() {
		GLabel l = new GLabel("Welcome to Instakilo!");
		l.setFont(MESSAGE_FONT);
		double x = (getWidth() - l.getWidth()) / 2;
		double y = (getHeight() - l.getHeight()) / 2;
		add(l, x, y);
	}

	private void createNewProfile(String name) {
		data.put(name, new ArrayList<String>());
		save();
	}

	private void save() {
		fileSystem.saveMap(data, DATAFILE_NAME);
	}

	//Graphics
	private void addInteractors() {

		JButton noFilterButton = new JButton(NO_FILTER);
		JButton blackAndWhiteButton = new JButton(BLACK_AND_WHITE);
		JButton displayButton = new JButton("Display");
		JButton newProfileButton = new JButton("Create");
		JButton newPhotoButton = new JButton("Post");

		add (noFilterButton, NORTH);
		add (blackAndWhiteButton, NORTH);
		add(new JLabel("Profile:"), WEST);
		add(nameInput, WEST);
		add(displayButton,WEST);
		add(newProfileButton, WEST);

		add(new JLabel("Photo:"), WEST);
		add(new JLabel("New photo name:"), WEST);
		add(newPhotoName, WEST);
		add(newPhotoButton, WEST);
		
		noFilterButton.addActionListener(this);
		blackAndWhiteButton.addActionListener(this);
		displayButton.addActionListener(this);
		newProfileButton.addActionListener(this);
		newPhotoButton.addActionListener(this);
	}

	private void displayMessage(String text) {
		GLabel msg = new GLabel(text);
		msg.setFont(MESSAGE_FONT);
		add(msg, LEFT_MARGIN, TOP_MARGIN + msg.getAscent());
	}

	private void displayProfile(String name) {
		
		if (name == null) {
			return;
		}
		
		if(!data.containsKey(name)) {
			displayMessage("no such profile");
			return;
		}
		
		currProfileName = name;
		removeAll();
		ArrayList<String> photos = data.get(name);

		//display profile name
		GLabel profileName = new GLabel(name);
		profileName.setFont(PROFILE_NAME_FONT);
		add(profileName, LEFT_MARGIN, TOP_MARGIN + profileName.getAscent());

		//display images
		double y = profileName.getY() + NAME_IMAGE_MARGIN;
		double x = LEFT_MARGIN;

		for(String photo : photos) {
			System.out.println(photo);
		}
		
		for (int i=0; i<photos.size(); i++ ) {
			String photo = photos.get(i);
			GImage image = new GImage(photo);
			image = applyFilter(image);

			if (image != null) {

				scaleImage(image);

				double imageRight = x + image.getWidth();
				double maxRight = getWidth() - RIGHT_MARGIN;
				if (imageRight >  maxRight) {
					//image doesn't fit on the current line
					//start a new line of images

					y += ROW_HEIGHT + IMAGE_IMAGE_MARGIN; 
					x = LEFT_MARGIN;
				}

				if(y + image.getHeight() > getHeight() - RIGHT_MARGIN) {
					break;
				}
				System.out.println("add " + photo);
				add(image, x, y);

				x += IMAGE_IMAGE_MARGIN + image.getWidth(); 
			}
		}
		System.out.println("done");
	}


	private GImage applyFilter(GImage img) {
		if (filter !=null && filter.equals(BLACK_AND_WHITE)) {
			img = toBlackAndWhite(img);
		}
		return img;
	}

	private void scaleImage(GImage image) {
		double amount = ROW_HEIGHT / image.getHeight();
		image.scale(amount);
	}

	public void actionPerformed(ActionEvent e) {
		String command = e.getActionCommand();
		println(command);
		if(command.equals("Display")) {
			displayProfile(nameInput.getText());
		} else if(command.equals("Create")) {
			String name = nameInput.getText();
			createNewProfile(name);
			displayProfile(name);
		} else if(command.equals("Post")) {
			postPhoto();
		} else if(command.equals(BLACK_AND_WHITE)) {
			filter = BLACK_AND_WHITE;
			displayProfile(currProfileName);
		} else if(command.equals(NO_FILTER)) {
			filter = NO_FILTER;
			displayProfile(currProfileName);
		}
	}

	private GImage toBlackAndWhite(GImage img) {
		int[][] pxls = img.getPixelArray();
		for (int i=0; i< pxls.length; i++) {
			for (int j=0; j<pxls[0].length; j++) {
				int oldVal = pxls[i][j];
				int red = GImage.getRed(oldVal);
				int green = GImage.getGreen(oldVal);
				int blue = GImage.getBlue(oldVal);
				
				int newRGB = (int) (0.21*red + 0.72*green + 0.07*blue);
				pxls[i][j] = GImage.createRGBPixel(newRGB, newRGB, newRGB);
			}
		}
		GImage transformedImg = new GImage(pxls);
		return transformedImg;
		
	}
	
	private void postPhoto() {
		if (currProfileName == null) {
			displayMessage("Please pick a profile first");
			return;
		}
		String photo = newPhotoName.getText();
		if (fileSystem.imageFileExists(photo)) {
			data.get(currProfileName).add(photo);

			save();
			displayProfile(currProfileName);
		}
		//displayMessage("Photo added");
	}	
	
}

