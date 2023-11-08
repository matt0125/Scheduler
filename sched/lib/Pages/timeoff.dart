import 'package:flutter/material.dart';

class TimeOffScreen extends StatefulWidget {
  @override
  _TimeOffScreenState createState() => _TimeOffScreenState();
}

class _TimeOffScreenState extends State<TimeOffScreen> {
  DateTimeRange? dateRange;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Time Off'),
        iconTheme: IconThemeData(
          color: Color(0xFF49423E),
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Image.asset(
                'assets/icon/Sched logo.png',
                fit: BoxFit.contain, // You can adjust BoxFit to your needs
                width: 150,  // Specify the desired width
                height: 150, // Specify the desired height
              ),

              SizedBox(height: 100), // Added white space
              Text(
                'Please select your desired time off',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF49423E),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: ElevatedButton(
                      child: Text(dateRange?.start == null
                          ? 'Select Start Date'
                          : '${dateRange!.start.year}/${dateRange!.start.month}/${dateRange!.start.day}'),
                      onPressed: () => pickStartDate(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      child: Text(dateRange?.end == null
                          ? 'Select End Date'
                          : '${dateRange!.end.year}/${dateRange!.end.month}/${dateRange!.end.day}'),
                      onPressed: () => pickEndDate(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                'Total time off: ${calculateTotalDays()} days',
                style: TextStyle(fontSize: 32),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  if (dateRange is DateTimeRange) {
                    // Show a confirmation dialog before saving the selected date range
                    showConfirmationDialog(context);
                  } else {
                    // Handle the case where no date range is selected
                    showDialog(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          title: Text('No Date Range Selected'),
                          content: Text('Please select a date range before submitting.'),
                          actions: [
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                              child: Text('OK'),
                            ),
                          ],
                        );
                      },
                    );
                  }
                },
                child: Text('Submit'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF49423E),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void pickStartDate(BuildContext context) async {
    DateTimeRange? newDateRange = await showDateRangePicker(
      context: context,
      initialDateRange: dateRange ?? DateTimeRange(
        start: DateTime.now(),
        end: DateTime.now(),
      ),
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
      confirmText: 'Save',
      cancelText: 'Cancel',
      helpText: 'Select Start Date',
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Color(0xFFB1947B),
              onPrimary: Color(0xFF49423E),
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: Color(0xFFB1947B),
              ),
            ),
          ),
          child: child!,
        );
      },
    );
    if (newDateRange != null) {
      setState(() {
        dateRange = newDateRange;
      });
    }
  }

  void pickEndDate(BuildContext context) async {
    DateTimeRange? newDateRange = await showDateRangePicker(
      context: context,
      initialDateRange: dateRange ?? DateTimeRange(
        start: DateTime.now(),
        end: DateTime.now(),
      ),
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
      confirmText: 'Save',
      cancelText: 'Cancel',
      helpText: 'Select End Date',
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Color(0xFFB1947B),
              onPrimary: Color(0xFF49423E),
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: Color(0xFFB1947B),
              ),
            ),
          ),
          child: child!,
        );
      },
    );

    if (newDateRange != null) {
      setState(() {
        dateRange = newDateRange;
      });
    }
  }

  int calculateTotalDays() {
    if (dateRange != null) {
      final start = dateRange!.start;
      final end = dateRange!.end;
      return end.difference(start).inDays + 1;
    } else {
      return 0;
    }
  }

  void saveSelectedDateRange() {
    // You can save the selected date range or perform any necessary actions here.
    // Modify this function according to your specific requirements.
    // The selected date range is available in the 'dateRange' variable.
    print('Selected Date Range: ${dateRange!.start} - ${dateRange!.end}');
  }

  void showConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirmation'),
          content: Text('Are you sure you want to request these days off?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('No'),
            ),
            TextButton(
              onPressed: () {
                saveSelectedDateRange(); // Save the selected date range
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('Yes'),
            ),
          ],
        );
      },
    );
  }
}


