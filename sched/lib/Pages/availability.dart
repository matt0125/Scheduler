import 'package:flutter/material.dart';

class AvailabilityScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Select your availability',
          style: TextStyle(
            color: Color(0xFF49423E),
          ),
        ),
      ),
      body: Row(
        children: [
          // Days of the week column
          Container(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                Text(
                  'Sunday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
                SizedBox(height: 15), // Add space between Sunday and Monday
                Text(
                  'Monday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
                SizedBox(height: 15), // Add space between Monday and Tuesday
                Text(
                  'Tuesday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
                SizedBox(height: 15), // Add space between Tuesday and Wednesday
                Text(
                  'Wednesday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
                SizedBox(height: 15), // Add space between Wednesday and Thursday
                Text(
                  'Thursday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
                SizedBox(height: 15), // Add space between Thursday and Friday
                Text(
                  'Friday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
                SizedBox(height: 15), // Add space between Friday and Saturday
                Text(
                  'Saturday',
                  style: TextStyle(
                    fontFamily: 'Katibeh',
                    fontSize: 35,
                    color: Color(0xFF49423E),
                  ),
                ),
              ],
            ),
          ),
          // Drop-down boxes
          Container(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                DropdownButton<String>(
                  items: ['Option 1', 'Option 2', 'Option 3']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    // Handle the drop-down value change
                  },
                ),
                SizedBox(height: 15), // Add space between drop-down boxes
                DropdownButton<String>(
                  items: ['Option A', 'Option B', 'Option C']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    // Handle the drop-down value change
                  },
                ),
                SizedBox(height: 15),
                DropdownButton<String>(
                  items: ['Option A', 'Option B', 'Option C']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    // Handle the drop-down value change
                  },
                ),
                SizedBox(height: 15),
                DropdownButton<String>(
                  items: ['Option A', 'Option B', 'Option C']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    // Handle the drop-down value change
                  },
                ),
                SizedBox(height: 15),
                DropdownButton<String>(
                  items: ['Option A', 'Option B', 'Option C']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    // Handle the drop-down value change
                  },
                ),
                SizedBox(height: 15),
                DropdownButton<String>(
                  items: ['Option A', 'Option B', 'Option C']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    // Handle the drop-down value change
                  },
                ),
                // Add space between drop-down boxes
                // Repeat for other days of the week
              ],
            ),
          ),
        ],
      ),
    );
  }
}
