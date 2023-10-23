import 'package:flutter/material.dart';
import 'calendar_widget.dart';
import 'loginpage.dart'; // Import the CalendarWidget

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.exit_to_app), // Use the exit icon
            onPressed: () {
              // Navigate back to the LoginPage
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => LoginPage()),
              );
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome to the Dashboard!',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            CalendarWidget(), // Use the CalendarWidget here
          ],
        ),
      ),
    );
  }
}
