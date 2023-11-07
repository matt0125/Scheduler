import 'package:flutter/material.dart';
import '../Widgets/calendar_widget.dart';
import '../Widgets/ScheduleCard.dart';

class DashboardPage extends StatefulWidget {
  DashboardPage() : super();

  @override
  bool get wantKeepAlive => true;
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final PageController _pageController = PageController();
  int currentIndex = 0; // Track the current index

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('Dashboard'),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            DaySelector(),
            SizedBox(height: 20),
            // Use a Container with a specified height
            Container(
              height: MediaQuery.of(context).size.height * 0.3, // Adjust the fraction as needed
              child: PageView(
                controller: _pageController,
                scrollDirection: Axis.horizontal,
                onPageChanged: (index) {
                  setState(() {
                    currentIndex = index;
                  });
                },
                children: <Widget>[
                  ScheduleCard(
                    date: 'November 6, 2023',
                    startTime: '10:00 AM',
                    endTime: '12:00 PM',
                    positionTitle: 'Meeting with Client 1',
                  ),
                  ScheduleCard(
                    date: 'November 7, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Conference Call 2',
                  ),
                  ScheduleCard(),
                  ScheduleCard(
                    date: 'November 7, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Conference Call 3',
                  ),
                  ScheduleCard(
                    date: 'November 7, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Conference Call 4',
                  ),
                  ScheduleCard(
                    date: 'November 7, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Conference Call 5',
                  ),
                  ScheduleCard(
                    date: 'November 7, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Conference Call 6',
                  ),
                  // Add more ScheduleCard widgets for the remaining days
                ],
              ),
            ),
            // Use a button to scroll to a specific item
            ElevatedButton(
              onPressed: () {
                // Example: Scroll to item at index 2 (0-based index)
                _pageController.animateToPage(2, duration: Duration(milliseconds: 300), curve: Curves.ease);
              },
              child: Text('Go to Item 2'),
            ),
          ],
        ),
      ),
    );
  }
}

class DaySelector extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    DateTime today = DateTime.now();
    int currentDay = today.weekday; // 1 for Monday, 7 for Sunday

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        for (int i = 0; i <= 6; i++) // Loop from Sunday (7) to Saturday (1)
          ElevatedButton(
            onPressed: () {
              // Implement your button logic here
            },

            style: ButtonStyle(
              shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0), // Adjust the value for roundness
                ),
              ),
              minimumSize: MaterialStateProperty.all(
                Size(MediaQuery.of(context).size.width / 14, 80), // Set the button width to screen width / 7
              ),
              backgroundColor: MaterialStateProperty.all(
                i == currentDay ? Colors.blue : Colors.grey, // Highlight today's day
              ),
            ),
            child: Text(getDayName(i, today.day)),
          ),
      ],
    );
  }

  String getDayName(int dayIndex, int day) {
    switch (dayIndex) {
      case 0:
        return 'S\n$day';
      case 1:
        return 'M\n$day';
      case 2:
        return 'T\n$day';
      case 3:
        return 'W\n$day';
      case 4:
        return 'T\n$day';
      case 5:
        return 'F\n$day';
      case 6:
        return 'S\n$day';
      default:
        return '';
    }
  }
}