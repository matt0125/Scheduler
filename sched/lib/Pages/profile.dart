import 'package:flutter/material.dart';
import 'package:sched/Services/DataService.dart';


class ProfileTab extends StatefulWidget {
  @override
  _ProfileTabState createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab>
    with AutomaticKeepAliveClientMixin<ProfileTab> {
  @override
  bool get wantKeepAlive => true;
  int counter = 0;

  void incrementCounter() {
    setState(() {
      counter++;
    });
  }

  void decrementCounter() {
    setState(() {
      if (counter > 0) {
        counter--;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('My Profile'),
        automaticallyImplyLeading: false,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.logout), // Exit icon for logout
            onPressed: () {
              DataService.clearEmpId();
              Navigator.pushReplacementNamed(
                context,
                '/login',
              );
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Profile Tab Content',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            Text(
              'Counter: $counter',
              style: TextStyle(fontSize: 18),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                ElevatedButton(
                  onPressed: incrementCounter,
                  child: Text('Increase'),
                ),
                SizedBox(width: 10),
                ElevatedButton(
                  onPressed: decrementCounter,
                  child: Text('Decrease'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
