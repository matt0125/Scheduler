import 'package:flutter/material.dart';

class TimeOffScreen extends StatefulWidget {
  @override
  _TimeOffScreenState createState() => _TimeOffScreenState();
}

class _TimeOffScreenState extends State<TimeOffScreen> {
  DateTimeRange dateRange = DateTimeRange(
    start: DateTime.now(),
    end: DateTime.now(),
  );

  @override
  Widget build(BuildContext context) {
    final start = dateRange.start;
    final end = dateRange.end;
    final difference = dateRange.duration;

    return Scaffold(
      appBar: AppBar(
        title: Text('Time Off'),
        iconTheme: IconThemeData(
          color: Color(0xFF49423E),
        ),
      ),
      body: Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Please select your desired time off',
              style: TextStyle(fontSize: 32),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  child: ElevatedButton(
                    child: Text('${start.year}/${start.month}/${start.day}'),
                    onPressed: () => pickDateRange(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFB1947B),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    child: Text('${end.year}/${end.month}/${end.day}'),
                    onPressed: () => pickDateRange(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFB1947B),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              'Total time off: ${difference.inDays} days',
              style: TextStyle(fontSize: 32),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // Show a confirmation dialog before saving the selected date range
                showConfirmationDialog(context);
              },
              child: Text('Submit'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF49423E),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future pickDateRange(BuildContext context) async {
    DateTimeRange? newDateRange = await showDateRangePicker(
      context: context,
      initialDateRange: dateRange,
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
      confirmText: 'Save', // Change the text for the "Save" button
      cancelText: 'Cancel', // Change the text for the "Cancel" button
      helpText: 'Select Time off', // Change the title
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Color(0xFFB1947B), // Change the primary color]
              onPrimary: Color(0xFF49423E),
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: Color(0xFFB1947B), // Change the text color to red
              ),
            ),
          ),
          child: child!,
        );
      },
    );
    if (newDateRange == null) return; // if 'x' is pressed
    setState(() => dateRange = newDateRange); // saved
  }



  void saveSelectedDateRange() {
    // You can save the selected date range or perform any necessary actions here.
    // Modify this function according to your specific requirements.
    // The selected date range is available in the 'dateRange' variable.
    print('Selected Date Range: ${dateRange.start} - ${dateRange.end}');
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
