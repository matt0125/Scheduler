import 'package:flutter/material.dart';
import '../Widgets/ScheduleCard.dart';
import '../Services/APIService.dart';
import '../Models/Shift.dart';
import 'package:intl/intl.dart';

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

  bool _isLoading = true;
  final api = APIService();
  List<Shift> _shifts = [];

  @override
  void initState() {
    super.initState();
    getShifts();
  }

  void getShifts() async {
    List<String> days = getSunSat();
    _shifts = await api.GetShiftsByEmpAndDate(days[0], days[1]);
    setState(() {
      _isLoading = false;
    });
  }

  List<String> getSunSat() {
    List<String> days = [];
    final today = DateTime.now();

    if (today.weekday == 7) {
      days.add(DateFormat('MM-dd-yyyy').format(today));
      days.add(DateFormat('MM-dd-yyyy').format(today.add(Duration(days: 6))));
    } else {
      days.add(DateFormat('MM-dd-yyyy').format(today.add(Duration(days: (-1 * today.weekday)))));
      days.add(DateFormat('MM-dd-yyyy').format(today.add(Duration(days: (6 + (-1 * today.weekday))))));
    }

    return days;
  }

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
          mainAxisAlignment: MainAxisAlignment.start, // Align content to the top
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 8.0, left: 8.0), // Adjust top and left padding as needed
              child: SchedLogoImage(),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0), // Adjust left padding as needed
              child: Sched(),
            ),
            DaySelector(pageController: _pageController, currentIndex: currentIndex),
            SizedBox(height: 20),
            Container(
              height: MediaQuery.of(context).size.height * 0.3,
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : PageView.builder(
                controller: _pageController,
                scrollDirection: Axis.horizontal,
                onPageChanged: (index) {
                  setState(() {
                    currentIndex = index;
                  });
                },
                itemCount: _shifts.length,
                itemBuilder: (context, index) {
                  return ScheduleCard(
                    shift: _shifts[index],
                  );
                },
              ),
            ),
            // Add a counter widget here to display the total hours worked for the week
            TotalHoursCounter(shifts: _shifts),
          ],
        ),
      ),
    );
  }
}

class DaySelector extends StatefulWidget {
  final PageController pageController;
  final int currentIndex;

  DaySelector({required this.pageController, required this.currentIndex});

  @override
  _DaySelectorState createState() => _DaySelectorState();
}

class _DaySelectorState extends State<DaySelector> {
  int selectedDayIndex = DateTime.now().weekday - 1;

  List<int> getDatesForWeek() {
    DateTime today = DateTime.now();
    DateTime sunday = today.weekday == 7 ? today : today.add(Duration(days: (-1 * today.weekday)));

    List<int> dates = [];

    for (int i = 0; i < 7; i++) {
      dates.add(int.parse(DateFormat('dd').format(sunday.add(Duration(days: i)))));
    }

    return dates;
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
              backgroundColor: MaterialStateProperty.all(
                widget.currentIndex == i ? Color(0xFFB1947B) : Color(0xFFEDE7E3),
              ),
              elevation: MaterialStateProperty.all<double>(
                widget.currentIndex == i ? 8.0 : 0.0, // Adjust the elevation value as needed
              ),
            ),
            child: Text(
              getDayName(i, datesForWeek[i]),
              style: TextStyle(
                color: widget.currentIndex == i ? Colors.white : Color(0xFF6d6a68),
              ),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }
}

class Sched extends StatelessWidget {
  const Sched({Key? key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: 50.0),
      child: Align(
        alignment: Alignment.center,
        child: const Text(
          "Sched",
          style: TextStyle(
            height: .05,
            fontFamily: 'Katibeh',
            fontSize: 100,
            fontWeight: FontWeight.w400,
            color: Color(0xFF49423E),
          ),
        ),
      ),
    );
  }
}

class SchedLogoImage extends StatelessWidget {
  const SchedLogoImage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        width: 90, // Set the desired width
        height: 100, // Adjusted total height (including empty space and image height)
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end, // Align the image to the bottom of the container
          children: [
            Container(
              height: 5, // Adjusted height for the empty space above the image
            ),
            Image.asset(
              'assets/icon/Sched logo.png',
              fit: BoxFit.contain, // You can adjust BoxFit to your needs
            ),
          ],
        ),
      ),
    );
  }
}

class TotalHoursCounter extends StatelessWidget {
  final List<Shift> shifts;

  const TotalHoursCounter({Key? key, required this.shifts}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Calculate total hours and format it as needed
    int totalHours = calculateTotalHours(shifts);
    String formattedHours = formatHours(totalHours);

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Text(
        'Total Hours: $formattedHours',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  int calculateTotalHours(List<Shift> shifts) {
    // Implement your logic to calculate total hours
    // Example: Sum up the duration of each shift
    int totalHours = 0;
    for (Shift shift in shifts) {
      // Calculate hours based on startTime and endTime
      if (shift.startTime != null && shift.endTime != null) {
        DateTime start = DateTime.parse(shift.startTime!);
        DateTime end = DateTime.parse(shift.endTime!);
        totalHours += end.difference(start).inHours;
      }
    }
    return totalHours;
  }

  String formatHours(int totalHours) {
    // Implement your logic to format hours as needed
    // Example: Convert total hours to a string with specific formatting
    return totalHours.toString();
  }
}