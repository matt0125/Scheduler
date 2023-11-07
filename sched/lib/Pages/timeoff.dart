import 'package:flutter/material.dart';

class TimeOffScreen extends StatefulWidget {
  @override
  _TimeOffScreenState createState() => _TimeOffScreenState();
}

class _TimeOffScreenState extends State<TimeOffScreen> {
  DateTime selectedDate = DateTime.now(); // Initialize with a default value
  String buttonText = "Please select a day(s)"; // Initialize the button text

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate, // Use the selectedDate as the initial date
      firstDate: DateTime(2022), // Set your desired minimum date
      lastDate: DateTime(2024), // Set your desired maximum date
    );

    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        buttonText = 'Selected Date: ${selectedDate.toLocal()}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Time Off'), //Going to ask mr.matthew about this
      ),
      body: Center(
        child: MaterialButton(
          onPressed: () {
            _selectDate(context);
          },
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Text(
              buttonText,
              style: TextStyle(fontSize: 20), // Add the font size
            ),
          ),
        ),
      ),
    );
  }
}
