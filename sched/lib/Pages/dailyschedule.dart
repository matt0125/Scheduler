import 'package:flutter/material.dart';
import '../Models/Shift.dart';
import '../Services/APIService.dart';
import '../Services/DataService.dart';


class DailySchedulePage extends StatefulWidget {
  final String date; // The specific date you want to display

  DailySchedulePage({required this.date});

  @override
  _DailySchedulePageState createState() => _DailySchedulePageState();
}

class _DailySchedulePageState extends State<DailySchedulePage> {
  bool _isLoading = true;
  List<Shift> _shifts = [];
  final api = APIService();

  @override
  void initState() {
    super.initState();
    getShifts();
  }

  void getShifts() async {
    _shifts = await api.GetShiftsByDate(
        DataService.readEmpId(), "10-10-2000", "10-10-2024");
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Filter shifts for the specific date

    return Scaffold(
      appBar: AppBar(
        title: Text("Daily Schedule"),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: _shifts.length,
        itemBuilder: (context, index) {
          return ShiftText(shift: _shifts[index]);
        },
      ),
    );
  }
}

class ShiftText extends StatelessWidget {
  final Shift shift;

  ShiftText({required this.shift});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Position: ${shift.positionTitle}", style: TextStyle(fontSize: 18)),
          Text("Time: ${shift.startTime} - ${shift.endTime}", style: TextStyle(fontSize: 16)),
          SizedBox(height: 10),
        ],
      ),
    );
  }
}
