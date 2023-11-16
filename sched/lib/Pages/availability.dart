import 'package:flutter/material.dart';

import '../Services/APIService.dart';

class AvailabilityScreen extends StatefulWidget {
  @override
  _AvailabilityScreenState createState() => _AvailabilityScreenState();
}

class _AvailabilityScreenState extends State<AvailabilityScreen> {
  List<String> daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  List<List<bool>> availability = List.generate(7, (index) => List.filled(24, true));
  List<List<String>> selectedTimes = List.generate(7, (index) => []);

  APIService apiService = APIService();

  int selectedDayIndex = -1;

  bool _loading = true;

  @override
  void initState() {
    super.initState();
    loadAvailability();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Select your availability', style: TextStyle(color: Color(0xFF49423E))),
      ),
      body: _loading ? Center(child: CircularProgressIndicator()) :
      Column(
        children: [
          // Days of the week row
          AnimatedContainer(
            duration: Duration(milliseconds: 225),
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
                  child: Text(
                    entry.value,
                    style: TextStyle(fontFamily: 'Katibeh', fontSize: 20, color: Colors.black),
                  ),
                ),
              ))
                  .toList(),
            ),
          ),
          // Selected day hours
          if (selectedDayIndex != -1)
            Expanded(
              flex: 31,
              child: PageView.builder(
                itemCount: daysOfWeek.length,
                controller: PageController(initialPage: selectedDayIndex),
                onPageChanged: (int page) {
                  setState(() {
                    selectedDayIndex = page;
                  });
                },
                itemBuilder: (context, index) {
                  return SingleChildScrollView(
                    child: GridView.builder(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 4),
                      itemCount: 24,
                      shrinkWrap: true,
                      itemBuilder: (context, timeIndex) {
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              availability[selectedDayIndex][timeIndex] =
                              !availability[selectedDayIndex][timeIndex];
                              if (availability[selectedDayIndex][timeIndex]) {
                                updateSelectedTimes(selectedDayIndex, timeIndex, true);
                              } else {
                                updateSelectedTimes(selectedDayIndex, timeIndex, false);
                              }
                            });
                          },
                          child: Container(
                            decoration: BoxDecoration(
                                border: Border.all(color: Colors.black),
                                color: availability[selectedDayIndex][timeIndex]
                                    ? Color(0xFFCDBFB6)
                                    : Colors.white),
                            child: Center(
                              child: Text(
                                '${timeIndex % 12 == 0 ? 12 : timeIndex % 12}:00 ${timeIndex < 12 ? 'AM' : 'PM'}',
                                style: TextStyle(fontSize: 14, color: Colors.black),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          // Selected times for each day
          Expanded(
            child: ListView.separated(
              itemCount: 7, // Set the itemCount to the number of days
              separatorBuilder: (context, index) => SizedBox(height: 16.0), // Adjust the height for vertical spacing
              itemBuilder: (context, dayIndex) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0), // Adjust the horizontal spacing as needed
                  child: ListTile(
                    title: Text(
                      formatSelectedTimesForDay(availability[dayIndex], daysOfWeek[dayIndex]),
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                );
              },
            ),
          ),
          // Save and Clear All Availability buttons
          Padding(
            padding: const EdgeInsets.only(bottom: 45.0), // Adjust the padding as needed
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () async {
                    await apiService.updateAvailability(availability);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'Availability has been set.',
                        ),
                        duration: Duration(milliseconds: 600),
                      ),
                    );
                    // saveAvailability();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFB1947B), // Change this color to the desired one
                  ),
                  child: Text('Save'),
                ),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'All availability has been cleared.',
                        ),
                        duration: Duration(milliseconds: 600),
                      ),
                    );
                    clearAllAvailability();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFB1947B), // Change this color to the desired one
                  ),
                  child: Text('Clear All Availability'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void updateSelectedTimes(int dayIndex, int timeIndex, bool isAdding) {
    if (isAdding) {
      selectedTimes[dayIndex].add(
          '${timeIndex % 12 == 0 ? 12 : timeIndex % 12}:00 ${timeIndex < 12 ? 'AM' : 'PM'}');
    } else {
      selectedTimes[dayIndex].remove(
          '${timeIndex % 12 == 0 ? 12 : timeIndex % 12}:00 ${timeIndex < 12 ? 'AM' : 'PM'}');
    }
    selectedTimes[dayIndex].sort(
            (a, b) => int.parse(a.split(':')[0]).compareTo(int.parse(b.split(':')[0])));
  }

  Future<void> loadAvailability() async {
    availability = await apiService.GetAvailabilities();
    setState(() {
      _loading = false;
    }); // Force a rebuild of the widget
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

String formatSelectedTimesForDay(List<bool> availabilityForDay, String dayOfWeek) {
  List<String> timesForDay = [];
  bool isInRange = false;
  int startHour = 0;

  for (int timeIndex = 0; timeIndex < 24; timeIndex++) {
    if (availabilityForDay[timeIndex]) {
      if (!isInRange) {
        // Start of a new range
        startHour = timeIndex;
        isInRange = true;
      }
    } else if (isInRange) {
      // End of the current range
      int endHour = timeIndex - 1;
      timesForDay.add(
          '${startHour == endHour ? '${endHour % 12 == 0 ? 12 : endHour % 12}:00 ${endHour < 12 ? 'AM' : 'PM'}' : '${startHour % 12 == 0 ? 12 : startHour % 12}:00 ${startHour < 12 ? 'AM' : 'PM'}-${endHour % 12 == 0 ? 12 : endHour % 12}:00 ${endHour < 12 ? 'AM' : 'PM'}'}');
      isInRange = false;
    }
  }

  // Check for a range that extends to the end of the day
  if (isInRange) {
    int endHour = 23;
    timesForDay.add(
        '${startHour % 12 == 0 ? 12 : startHour % 12}:00 ${startHour < 12 ? 'AM' : 'PM'}-${endHour % 12 == 0 ? 12 : endHour % 12}:00 ${endHour < 12 ? 'AM' : 'PM'}');
  }

  if (timesForDay.isNotEmpty) {
    return '$dayOfWeek: ${timesForDay.join(', ')}';
  } else {
    return '$dayOfWeek: Not available';
  }
}

void main() {
  runApp(MaterialApp(home: AvailabilityScreen()));
}
