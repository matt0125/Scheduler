import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WelcomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Let\'s get started!'),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Welcome to our app!',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                // Check if the welcome page has been shown before
                final prefs = await SharedPreferences.getInstance();
                bool welcomeShown = prefs.getBool('welcomeShown') ?? false;

                if (!welcomeShown) {
                  // If the welcome page hasn't been shown, mark it as shown
                  prefs.setBool('welcomeShown', true);

                  // Navigate to the dashboard page
                  Navigator.pushReplacementNamed(context, '/');
                } else {
                  // If the welcome page has been shown, navigate to the dashboard directly
                  Navigator.pushReplacementNamed(context, '/');
                }
              },
              child: Text('Get Started'),
            ),
          ],
        ),
      ),
    );
  }
}
