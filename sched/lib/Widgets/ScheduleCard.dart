import 'package:flutter/material.dart';
import '../Models/Shift.dart';

class ScheduleCard extends StatelessWidget {
  final Shift shift;

  String? printTime;

  ScheduleCard({
    required this.shift
  });

  @override
  Widget build(BuildContext context) {
    Widget cardContent;

    if (this.shift.isWorking == false) {
      cardContent = Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Container(
            padding: EdgeInsets.all(8.0),
            alignment: Alignment.topRight,
            child: Text(
              shift.date ?? '',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          SizedBox(height: 46),
          Text(
            'Not scheduled',
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
          ),
        ],
      );
    } else {
      cardContent = Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Container(
            padding: EdgeInsets.all(8.0),
            alignment: Alignment.topRight,
            child: Text(
              shift.date ?? '',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          SizedBox(height: 10),
          Text(
            numHours(shift.startTime!, shift.endTime!),
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
          ),
          Text(
            '\n${shift.positionTitle}',
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Container(
            padding: EdgeInsets.all(1.0),
            alignment: Alignment.bottomCenter,
            child: Text(
              shift.printTime!,
              style: TextStyle(fontSize: 24),
            ),
          ),
        ],
      );
    }

    return Container(
      padding: EdgeInsets.all(15.0), // Adjust the padding as needed
      decoration: BoxDecoration(
        color: Color(0xFFCDBFB6), // Choose a color for the surrounding card
        borderRadius: BorderRadius.circular(16.0), // Rounded corners
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5), // Choose a color for the shadow
            spreadRadius: 2,
            blurRadius: 3,
            offset: Offset(2, 2), // changes the position of the shadow
          ),
        ],
      ),
      margin: EdgeInsets.all(16.0), // Add some margin for spacing
      child: SizedBox(
        width: 200, // Adjust the width as needed
        child: Card(
          // The inner card's properties
          elevation: 0, // Set this to 0 to prevent double shadow effect
          color: Color(0xFFEDE7E3), // Set the background color of the inside of the card
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0), // Rounded corners
          ),
          child: InkWell(
            onTap: () {
              // Navigate to the 'dailyschedule' page when the card is tapped
              Navigator.pushNamed(context, '/dailyschedule/${shift.unformattedDate}');
            },
            child: cardContent,
          ),
        ),
      ),
    );

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
    try{
      if (startTime.split(" ")[1] == "PM")
        startH += 12;
      if (endTime.split(" ")[1] == "PM")
        endH += 12;
    }
    catch(e){
      print(e);
    }

    return (endH-startH).toString() +
        (endM-startM != 0 ? ((endM-startM)/60).toStringAsFixed(2) : "") +
        " hours";
  }
}
