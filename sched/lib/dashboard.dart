import 'package:flutter/material.dart';
import 'calendar_widget.dart';
import 'loginpage.dart';

class DashboardPage extends StatefulWidget {
  DashboardPage() : super();

  @override
  bool get wantKeepAlive => true;
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey, // Assign the GlobalKey to the Scaffold
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Welcome to the Dashboard!',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            CalendarWidget(), // Use the CalendarWidget here
          ],
        ),
      ),
    );
  }
}
