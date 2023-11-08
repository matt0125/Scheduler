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
            DaySelector(pageController: _pageController),
            SizedBox(height: 20),
            // Use a Container with a specified height
            Container(
              height: MediaQuery.of(context).size.height * 0.3, // Adjust the fraction as needed
              // width: MediaQuery.of(context).size.width * 0.85,
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
                    date: 'November 5, 2023',
                    startTime: '10:00 AM',
                    endTime: '12:00 PM',
                    positionTitle: 'Host',
                  ),
                  ScheduleCard(
                    date: 'November 6, 2023',
                    startTime: '12:00 AM',
                    endTime: '4:00 PM',
                    positionTitle: 'Busser',
                  ),
                  ScheduleCard(),
                  ScheduleCard(
                    date: 'November 8, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Host',
                  ),
                  ScheduleCard(
                    date: 'November 9, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Server',
                  ),
                  ScheduleCard(
                    date: 'November 10, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Carry Out',
                  ),
                  ScheduleCard(
                    date: 'November 11, 2023',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    positionTitle: 'Conference Call 6',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
class DaySelector extends StatefulWidget {
  final PageController pageController;

  DaySelector({required this.pageController});

  @override
  _DaySelectorState createState() => _DaySelectorState();
}

class _DaySelectorState extends State<DaySelector> {
  int selectedDayIndex = DateTime.now().weekday - 1;

  List<int> getDatesForWeek() {
    final now = DateTime.now();
    final dayIndex = now.weekday;
    final currentDay = now.day;

    final List<int> datesForWeek = List.generate(7, (index) {
      final daysDifference = dayIndex - index;
      final date = currentDay - daysDifference;
      return date;
    });

    return datesForWeek;
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

  @override
  Widget build(BuildContext context) {
    final datesForWeek = getDatesForWeek();
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        for (int i = 0; i <= 6; i++)
          ElevatedButton(
            onPressed: () {
              setState(() {
                selectedDayIndex = i;
              });
              widget.pageController.animateToPage(i, duration: Duration(milliseconds: 300), curve: Curves.ease);
            },
            style: ButtonStyle(
              shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
              ),
              minimumSize: MaterialStateProperty.all(
                Size(MediaQuery.of(context).size.width / 14, 80),
              ),
              backgroundColor: MaterialStateProperty.all( Color(0xFFEDE7E3) ),
            ),
            child: Text(
                getDayName(i, datesForWeek[i]),
              style: TextStyle(
                color: Color(0xFF6d6a68),
              ),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }
}
