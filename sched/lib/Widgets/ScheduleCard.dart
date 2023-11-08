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
          elevation: 4, // Add some elevation for a card-like effect
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0), // Rounded corners
          ),
          margin: EdgeInsets.all(16.0), // Add some margin for spacing

          child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Container(
                  padding: EdgeInsets.all(8.0),
                  alignment: Alignment.topRight,
                  child: Text(
                    date ?? '',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(height: 40),
                Text(
                  numHours(startTime!, endTime!),
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                ),
                Text(
                  '\n$positionTitle',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                ),

                SizedBox(height: 28),
                Container(
                  padding: EdgeInsets.all(8.0),
                  alignment: Alignment.bottomCenter,
                  child: Text(
                    startTime!.split(" ")[1] == endTime!.split(" ")[1] ?
                    (startTime!.split(" ")[0] + ' - $endTime') :
                    '$startTime - $endTime',
                    style: TextStyle(fontSize: 24),
                  ),
                  ),
              ],
            ),
      );
    }
  }

  String numHours(String startTime, String endTime) {

    int startH = int.parse(startTime.split(":")[0]);
    int startM = int.parse(startTime.split(" ")[0].split(":")[1]);
    int endH = int.parse(endTime.split(":")[0]);
    int endM = int.parse(endTime.split(" ")[0].split(":")[1]);

    if (startH == 12)
    {
      startH = 0;
    }
    if (endH == 12)
    {
      endH = 0;
    }

    if (startTime.split(" ")[1] == "PM")
      startH += 12;
    if (endTime.split(" ")[1] == "PM")
      endH += 12;

    return (endH-startH).toString() +
        (endM-startM != 0 ? ((endM-startM)/60).toStringAsFixed(2) : "") +
        " hours";
  }
}
