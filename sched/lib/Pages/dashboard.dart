import 'package:flutter/material.dart';
import '../Widgets/ScheduleCard.dart';
import '../Services/APIService.dart';
import '../Services/DataService.dart';
import '../Models/Shift.dart';

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
  void initState()
  {
    super.initState();
    getShifts();
  }

  void getShifts() async{
    _shifts = await api.GetShiftsByDate(DataService.readEmpId(), "10-10-2000", "10-10-2024");
    setState(() {
      _isLoading = false;
    });
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
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            DaySelector(pageController: _pageController),
            SizedBox(height: 20),
            // Use a Container with a specified height
            Container(
              height: MediaQuery.of(context).size.height * 0.3, // Adjust the fraction as needed
              // width: MediaQuery.of(context).size.width * 0.85,
              child: _isLoading ? Center(child: CircularProgressIndicator()):
                  PageView.builder(
                      controller: _pageController,
                      scrollDirection: Axis.horizontal,
                      onPageChanged: (index) {
                        setState(() {
                          currentIndex = index;
                        });
                      },
                      itemCount: _shifts.length,
                      itemBuilder: (context, index){
                        return ScheduleCard(
                          date: _shifts[index].date,
                          startTime: _shifts[index].startTime,
                          endTime: _shifts[index].endTime,
                          positionTitle: _shifts[index].positionTitle,
                        );
                      }),
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
