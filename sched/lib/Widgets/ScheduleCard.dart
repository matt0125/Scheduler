import 'package:flutter/material.dart';

class ScheduleCard extends StatelessWidget {
  final String? date;
  final String? startTime;
  final String? endTime;
  final String? positionTitle;

  ScheduleCard({
    this.date,
    this.startTime,
    this.endTime,
    this.positionTitle,
  });

  @override
  Widget build(BuildContext context) {
    if (this.date == null)
      return Container();
    else {
      return Card(
        elevation: 4, // Add shadow to the card
        margin: EdgeInsets.all(16), // Add margin around the card
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '$date',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8), // Add spacing between elements
              Text(
                '$startTime-$endTime',
                style: TextStyle(fontSize: 14),
              ),
              SizedBox(height: 8), // Add spacing between elements
              Text(
                '$positionTitle',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      );
    }
  }
}
