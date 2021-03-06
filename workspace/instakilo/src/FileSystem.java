import java.io.*;
import java.util.*;
import acm.graphics.GImage;
import acm.util.ErrorException;
import org.json.*;

public class FileSystem {

	public boolean imageFileExists(String imageFilename) {
		boolean exists = true;
		try{
			new GImage(imageFilename);
		} catch(ErrorException e) {
			exists = false;		
		}
		return exists;
	}

	public void saveMap(HashMap<String, ArrayList<String>> map, String fileName) {
		String jsonStr = mapToJsonStr(map);

		File f = new File(fileName);
		FileWriter file = null;
		try {
			file = new FileWriter(f);
			file.write(jsonStr);
			file.flush();
			file.close();
		} catch (IOException e) {
			throw new RuntimeException(e);
		} 
	}

	public HashMap<String, ArrayList<String>> loadMap(String fileName)  {
		String jsonStr = "";
		try {
			Scanner codeIn = new Scanner(new File(fileName));
			while (codeIn.hasNextLine()) {
				jsonStr += codeIn.nextLine() + "\n";
			}
		} catch(Exception e) {
			throw new RuntimeException(e);
		} 
		
		return jsonStrToMap(jsonStr);
	}
	
	/*************************************************************************
	 *  PRIVATE: Helper methods for decomposition
	 *************************************************************************/

	private HashMap<String, ArrayList<String>> jsonStrToMap(String content) {
		HashMap<String, ArrayList<String>> map = new HashMap<String, ArrayList<String>>();
		JSONObject json = new JSONObject(content);
		Iterator<String> iter = json.keys();
        while (iter.hasNext()) {
        	String key = iter.next();
			JSONArray jsonArray = json.getJSONArray(key);
			ArrayList<String> items = new ArrayList<String>();
			for(int i = 0; i < jsonArray.length(); i++) {
				String item = jsonArray.getString(i);
				items.add(item);
			}
			map.put(key, items);
		}
        return map;
	}
	
	private String mapToJsonStr(HashMap<String, ArrayList<String>> dataMap) {
		JSONObject json = new JSONObject();
		for(String key : dataMap.keySet()) {
			List<String> items = dataMap.get(key);
			if(items == null) {
				throw new RuntimeException("The ArrayList for " + key + " is null.");
			}
			JSONArray itemsJson = new JSONArray();
			for(String item : items) {
				itemsJson.put(item);
			}
			json.put(key, itemsJson);
		}
		String jsonStr = json.toString(4);
		return jsonStr;
	}

}
