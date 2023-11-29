import 'package:flutter/material.dart';
import '../Models/FullShift.dart';
import '../Services/APIService.dart';

class DailySchedulePage extends StatefulWidget {
  final String date; // The specific date you want to display

  DailySchedulePage({required this.date});

  @override
  _DailySchedulePageState createState() => _DailySchedulePageState();
}

class _DailySchedulePageState extends State<DailySchedulePage> {
  bool _isLoading = true;
  List<FullShift> _shifts = [];
  final api = APIService();

  @override
  void initState() {
    super.initState();
    getShifts();
  }

  void getShifts() async {
    _shifts = await api.GetShiftsByDate(widget.date);

    // Sort the shifts based on shift start time
    _shifts.sort((a, b) => a.shiftStartTime!.compareTo(b.shiftStartTime!));

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Daily Schedule"),
        iconTheme: IconThemeData(
          color: Color(0xFF49423E),
        ),
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
  final FullShift shift;

  ShiftText({required this.shift});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("${shift.fullName} - ${shift.printPositionTitle}",
              style: TextStyle(fontSize: 22)),
          Text("${shift.printTime}", style: TextStyle(fontSize: 18)),
          SizedBox(height: 5),
          Divider(),
          SizedBox(height: 5),
        ],
      ),
    );
  }
}
