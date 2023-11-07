import 'package:flutter/material.dart';
import 'package:sched/Services/DataService.dart';
import 'availability.dart';
import 'timeoff.dart';


class ProfileTab extends StatefulWidget {
  @override
  _ProfileTabState createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> with AutomaticKeepAliveClientMixin<ProfileTab> {
  @override
  bool get wantKeepAlive => true;
  // DateTime selectedDate = DateTime.now(); // Initialize with a default value
  // String buttonText = "Time-off"; // Initialize the button text

  // Future<void> _selectDate(BuildContext context) async {
  //   final DateTime? picked = await showDatePicker(
  //     context: context,
  //     initialDate: selectedDate, // Use the selectedDate as the initial date
  //     firstDate: DateTime(2023), // Set your desired minimum date
  //     lastDate: DateTime(2024), // Set your desired maximum date
  //   );
  //
  //   if (picked != null && picked != selectedDate) {
  //     setState(() {
  //       selectedDate = picked;
  //       buttonText = 'Selected Date: ${selectedDate.toLocal()}';
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('My Profile'),
        automaticallyImplyLeading: false,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.logout), // Exit icon for logout
            color: Color(0xFF6d6a68),
            onPressed: () {
              DataService.clearEmpId();
              Navigator.pushReplacementNamed(
                context,
                '/login',
              );
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(left: 20, top: 10), // Adjust the left padding as needed
          child: Stack(
            children: <Widget>[
              Positioned(
                top: 0,
                left: 0,
                child: Container(
                  width: 100, // Adjust the size as needed
                  height: 100, // Adjust the size as needed
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF49423E), // Background color for the profile picture
                  ),
                  child: Icon(
                    Icons.person, // Replace with your profile picture
                    size: 60, // Adjust the size as needed
                    color: Colors.white,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 120), // Adjust the top padding as needed
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[

                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => AvailabilityScreen()), // Replace with your AvailabilityScreen widget
                        );
                      },
                      child: Text('Availability'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => TimeOffScreen()), // Navigate to TimeOffScreen
                        );
                      },
                      child: Text('Time-off'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B), // Background color for the "Time-off" button
                      ),
                    ),

                    ElevatedButton(
                      onPressed: () {
                        // Add functionality for "Settings" button here
                      },
                      child: Text('Profile Settings'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B), // Background color for the "Settings" button
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}


