import 'package:flutter/material.dart';

class AvailabilityScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Availability'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Hey whats up Matt',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            // Add your availability-related content here
          ],
        ),
      ),
    );
  }
}
