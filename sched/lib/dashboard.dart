import 'package:flutter/material.dart';
import 'calendar_widget.dart';
import 'loginpage.dart';

class DashboardPage extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey, // Assign the GlobalKey to the Scaffold
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.exit_to_app), // Exit icon for logout
            onPressed: () {
              // Navigate back to the LoginPage
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => LoginPage()),
              );
            },
          ),
        ],
        leading: IconButton(
          icon: const Icon(Icons.dashboard), // Dashboard icon for sidebar
          onPressed: () {
            // Open the sidebar (Drawer)
            _scaffoldKey.currentState?.openDrawer();
          },
        ),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text(
                'Sidebar Navigation',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              title: const Text('Option 1'),
              onTap: () {
                // Handle Option 1 navigation here
                Navigator.pop(context); // Close the sidebar
              },
            ),
            ListTile(
              title: const Text('Option 2'),
              onTap: () {
                // Handle Option 2 navigation here
                Navigator.pop(context); // Close the sidebar
              },
            ),
            ListTile(
              title: const Text('Option 3'),
              onTap: () {
                // Handle Option 3 navigation here
                Navigator.pop(context); // Close the sidebar
              },
            ),
          ],
        ),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Welcome to the Dashboard!',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            CalendarWidget(), // Use the CalendarWidget here
          ],
        ),
      ),
    );
  }
}
