import 'dart:io';

import 'package:flutter/material.dart';
import 'package:sched/Services/APIService.dart';

import '../Models/Employee.dart';
import '../Models/Position.dart';
import '../tabs.dart';


class WelcomePage extends StatefulWidget {
  @override
  _WelcomePageState createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {

  bool _firstPage = true;
  bool _secondPage = true;
  bool _thirdPage = true;
  bool _isVerified = false;
  List<Employee> _managers = [];
  List<Position> _positions = [];
  int? _selectedIndex;

  APIService apiService = APIService();

  @override
  void initState(){
    super.initState();
    verifyEmail();
    populateManagers();
    populatePositions();
  }

  Future<void> verifyEmail() async {
    // check if verified

    while(!_isVerified) {
      // check again then wait
      await Future.delayed(Duration(seconds: 5));
      break;
    }
    setState(() {
      _isVerified = true;
    });
  }

  Future<void> populateManagers() async {

    await Future.delayed(Duration(seconds: 1));
    _managers = await apiService.GetAllManagers();
  }

  Future<void> populatePositions() async {
    await Future.delayed(Duration(seconds: 2));
    _positions = await apiService.GetAllPositions();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Lets get started!'),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: _firstPage ? (
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                'Welcome to Sched!',
                style: TextStyle(fontSize: 24),
              ),
              SizedBox(height: 20),
              Text(
                'To get started, please verify your email',
                style: TextStyle(fontSize: 24),
              ),
              SizedBox(height: 20),
              !_isVerified ? (
                CircularProgressIndicator()
              ) : (
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _firstPage = false;
                    });
                  },
                  child: Text('Lets Go!'),
                )
              ),
            ],
          )
        ) : ( _secondPage ? (
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'Next, select your manager.',
                  style: TextStyle(fontSize: 24),
                ),
                SizedBox(height: 20),
                _managers.length != 0 ? (
                Container(
                  height: .6 * MediaQuery.of(context).size.height,
                  child: ListView.builder(
                    itemCount: _managers.length,
                    itemBuilder: (context, index) {
                      return GestureDetector(
                          onTap: () {
                            setState(() {
                              if (_selectedIndex == index) {
                                _selectedIndex = null;
                              } else {
                                _selectedIndex = index;
                              }
                            });
                          },
                          child: ListTile(
                            title: Text(
                              _managers[index].fullName,
                              style: TextStyle(fontWeight: (_selectedIndex == index) ? FontWeight.bold: FontWeight.normal ),
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    SizedBox(height: 12),
                                    Text(
                                      _managers[index].email,
                                      style: TextStyle(fontWeight: (_selectedIndex == index) ? FontWeight.bold: FontWeight.normal ),
                                    ),
                                    // Add spacing here
                                    Text(
                                      _managers[index].phone,
                                      style: TextStyle(fontWeight: (_selectedIndex == index) ? FontWeight.bold: FontWeight.normal ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            subtitle: Text(
                              _managers[index].positionTitles.join(', '),
                              style: TextStyle(fontWeight: (_selectedIndex == index) ? FontWeight.bold: FontWeight.normal ),
                            ), // Display all positions
                          )
                      );
                    },
                  )
                  )

                ) : (
                    CircularProgressIndicator()
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () async {

                    setState(() {
                      _secondPage = false;
                      _selectedIndex = null;
                    });
                  },
                  child: Text('Submit'),
                ),
              ],
            )
        ) : ( _thirdPage ? (
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'What positions do you work?',
                  style: TextStyle(fontSize: 24),
                ),
                SizedBox(height: 20),
                _positions.length != 0 ? (
                    Container(
                        height: .6 * MediaQuery.of(context).size.height,
                        child: ListView.builder(
                          itemCount: _positions.length,
                          itemBuilder: (context, index) {
                            return GestureDetector(
                                onTap: () {
                                  setState(() {
                                    if (_selectedIndex == index) {
                                      _selectedIndex = null;
                                    } else {
                                      _selectedIndex = index;
                                    }
                                  });
                                },
                                child: ListTile(
                                  title: Text(
                                    _positions[index].printName,
                                    style: TextStyle(fontWeight: (_selectedIndex == index) ? FontWeight.bold: FontWeight.normal ),
                                  ),
                                )
                            );
                          },
                        )
                    )

                ) : (
                    CircularProgressIndicator()
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () async {
                    // set positions
                    setState(() {
                      _thirdPage = false;
                    });
                    },
                  child: Text('Submit'),
                ),
              ],
            )
        ) : (
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'Welcome to Sched!',
                  style: TextStyle(fontSize: 24),
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacement(context,
                      MaterialPageRoute(
                        builder: (context) => TabsPage(), // Pass the user ID if needed
                      ),
                    );
                  },
                  child: Text('Lets go!'),
                ),
              ],
            )
        )
        )
        )
      ),
    );
  }
}
