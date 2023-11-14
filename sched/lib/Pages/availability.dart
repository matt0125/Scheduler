import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AvailabilityScreen extends StatefulWidget {
  @override
  _AvailabilityScreenState createState() => _AvailabilityScreenState();
}

class _AvailabilityScreenState extends State<AvailabilityScreen> {
  List<String> daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  List<List<bool>> availability = List.generate(7, (index) => List.filled(24, false));
  List<List<String>> selectedTimes = List.generate(7, (index) => []);

  int selectedDayIndex = -1;

  @override
  void initState() {
    super.initState();
    // Load saved availability from SharedPreferences
    loadAvailability();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Select your availability', style: TextStyle(color: Color(0xFF49423E))),
      ),
      body: Column(
        children: [
          // Days of the week row
          AnimatedContainer(
            duration: Duration(milliseconds: 500),
            height: selectedDayIndex != -1 ? 50 : 150, // Adjusted height for animation
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: daysOfWeek
                  .asMap()
                  .entries
                  .map((entry) => GestureDetector(
                onTap: () {
                  setState(() {
                    selectedDayIndex = selectedDayIndex == entry.key ? -1 : entry.key;
                  });
                },
                child: Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: selectedDayIndex == entry.key ? Color(0xFFB1947B) : Colors.white,
                    border: Border.all(color: Colors.black),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(entry.value, style: TextStyle(fontFamily: 'Katibeh', fontSize: 20, color: Colors.black)),
                ),
              ))
                  .toList(),
            ),
          ),
          // Selected day hours
          if (selectedDayIndex != -1)
            Expanded(
              child: SingleChildScrollView(
                child: GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 4),
                  itemCount: 24,
                  shrinkWrap: true,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          availability[selectedDayIndex][index] = !availability[selectedDayIndex][index];
                          if (availability[selectedDayIndex][index]) {
                            updateSelectedTimes(selectedDayIndex, index, true);
                          } else {
                            updateSelectedTimes(selectedDayIndex, index, false);
                          }
                        });
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            border: Border.all(color: Colors.black),
                            color: availability[selectedDayIndex][index] ? Color(0xFFCDBFB6) : Colors.white),
                        child: Center(
                          child: Text(
                            '${index % 12 == 0 ? 12 : index % 12}:00 ${index < 12 ? 'AM' : 'PM'}',
                            style: TextStyle(fontSize: 14, color: Colors.black),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          // Selected times for each day
          Expanded(
            child: ListView.builder(
              itemCount: daysOfWeek.length,
              itemBuilder: (context, dayIndex) {
                return ListTile(
                  title: Text(
                    '${daysOfWeek[dayIndex]}: ${formatSelectedTimes(selectedTimes[dayIndex])}',
                    style: TextStyle(fontSize: 16),
                  ),
                );
              },
            ),
          ),
          // Save and Clear All Availability buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () {
                  saveAvailability();
                },
                child: Text('Save'),
              ),
              ElevatedButton(
                onPressed: () {
                  clearAllAvailability();
                },
                child: Text('Clear All Availability'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void updateSelectedTimes(int dayIndex, int timeIndex, bool isAdding) {
    if (isAdding) {
      selectedTimes[dayIndex].add('${timeIndex % 12 == 0 ? 12 : timeIndex % 12}:00 ${timeIndex < 12 ? 'AM' : 'PM'}');
    } else {
      selectedTimes[dayIndex].remove('${timeIndex % 12 == 0 ? 12 : timeIndex % 12}:00 ${timeIndex < 12 ? 'AM' : 'PM'}');
    }
    selectedTimes[dayIndex].sort((a, b) => int.parse(a.split(':')[0]).compareTo(int.parse(b.split(':')[0])));
  }

  String formatSelectedTimes(List<String> times) {
    if (times.isEmpty) return 'No selected times';
    List<String> formattedTimes = [];
    int start = 0, end = 0;
    for (int i = 1; i < times.length; i++) {
      if (int.parse(times[i - 1].split(':')[0]) + 1 == int.parse(times[i].split(':')[0]) &&
          times[i - 1].split(' ')[1] == times[i].split(' ')[1]) {
        end = i;
      } else {
        if (start == end) {
          formattedTimes.add(times[start]);
        } else {
          formattedTimes.add('${times[start]}-${times[end]}');
        }
        start = end = i;
      }
    }
    if (start == end) {
      formattedTimes.add(times[start]);
    } else {
      formattedTimes.add('${times[start]}-${times[end]}');
    }
    return formattedTimes.join(', ');
  }

  // Save availability to SharedPreferences
  Future<void> saveAvailability() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    for (int i = 0; i < daysOfWeek.length; i++) {
      prefs.setStringList('$i', selectedTimes[i]);
    }
  }

  // Load availability from SharedPreferences
  Future<void> loadAvailability() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    for (int i = 0; i < daysOfWeek.length; i++) {
      List<String>? savedTimes = prefs.getStringList('$i');
      if (savedTimes != null) {
        selectedTimes[i] = savedTimes;
        for (String time in savedTimes) {
          int timeIndex = int.parse(time.split(':')[0]);
          availability[i][timeIndex] = true;
        }
      }
    }
    setState(() {}); // Force a rebuild of the widget
  }

  // Clear all selected times
  void clearAllAvailability() {
    for (int i = 0; i < daysOfWeek.length; i++) {
      selectedTimes[i].clear();
      for (int j = 0; j < 24; j++) {
        availability[i][j] = false;
      }
    }
    setState(() {});
  }
}

void main() {
  runApp(MaterialApp(home: AvailabilityScreen()));
}
