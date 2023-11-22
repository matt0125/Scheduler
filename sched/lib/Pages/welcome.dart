import 'dart:io';
import 'package:flutter/material.dart';
import 'package:sched/Services/APIService.dart';
import '../Models/Employee.dart';
import '../Models/Position.dart';
import '../Widgets/popup.dart';
import '../tabs.dart';

// Add a custom CheckBubble widget
class CheckBubble extends StatelessWidget {
  final bool isSelected;
  final Color bubbleColor;

  const CheckBubble({
    Key? key,
    required this.isSelected,
    this.bubbleColor = Colors.blue,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 20,
      height: 20,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isSelected ? bubbleColor : Colors.transparent,
        border: Border.all(
          color: bubbleColor,
          width: 2,
        ),
      ),
    );
  }
}


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
  int? _selectedManagerIndex;
  List<int> _selectedPositionIndex = [];

  APIService apiService = APIService();

  @override
  void initState() {
    super.initState();
    verifyEmail();
    populateManagers();
    populatePositions();
  }

  Future<void> verifyEmail() async {
    // check if verified

    while (!_isVerified) {
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

    // Ensure that the result of GetAllManagers is not null before assigning it to _managers
    List<Employee> managers = await apiService.GetAllManagers();

    if (managers != null) {
      _managers = managers;
    } else {
      // Handle the case where GetAllManagers returns null
      print('Error: GetAllManagers returned null');
    }
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
        child: _firstPage
            ? Column(
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
            !_isVerified
                ? CircularProgressIndicator()
                : ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFB1947B),
              ),
              onPressed: () {
                setState(() {
                  _firstPage = false;
                });
              },
              child: Text('Lets Go!'),
            ),
          ],
        )
            : _secondPage
            ? Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Next, select your manager.',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            _managers.length != 0
                ? Container(
              height: .6 * MediaQuery.of(context).size.height,
              child: ListView.builder(
                itemCount: _managers.length,
                itemBuilder: (context, index) {
                  return Column(
                    children: [
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            if (_selectedManagerIndex == index) {
                              _selectedManagerIndex = null;
                            } else {
                              _selectedManagerIndex = index;
                            }
                          });
                        },
                        child: ListTile(
                          title: Text(
                            _managers[index].fullName,
                            style: TextStyle(
                              fontWeight: _selectedManagerIndex == index
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
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
                                    style: TextStyle(
                                      fontWeight: _selectedManagerIndex == index
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                  Text(
                                    _managers[index].phone,
                                    style: TextStyle(
                                      fontWeight: _selectedManagerIndex == index
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          subtitle: Text(
                            _managers[index].positionTitles.join(', '),
                            style: TextStyle(
                              fontWeight: _selectedManagerIndex == index
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ), // Display all positions
                        ),
                      ),
                      if (index < _managers.length - 1)
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 20),
                          child: Divider(
                            color: Colors.grey,
                            thickness: 1,
                          ),
                        ),
                    ],
                  );
                },
              ),
            )
                : CircularProgressIndicator(),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFB1947B),
              ),
              onPressed: () async {
                if (_selectedManagerIndex == null) {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text("Uh oh!"),
                        content: Text("Please select a manager"),
                        actions: [
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFB1947B),
                            ),
                            onPressed: () {
                              Navigator.pop(context); // Close the dialog
                            },
                            child: Text("OK"),
                          ),
                        ],
                      );
                    },
                  );
                } else {
                  if ((await apiService.AssignManager(
                      _managers[_selectedManagerIndex!].employeeId!))
                      .success!) {
                    setState(() {
                      _secondPage = false;
                      _selectedManagerIndex = null;
                    });
                  }
                }
              },
              child: Text('Submit'),
            ),
          ],
        )
            : _thirdPage
            ? Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'What positions do you work?',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            _positions.length != 0
                ? Container(
              height: .6 * MediaQuery.of(context).size.height,
              child: ListView.builder(
                itemCount: _positions.length,
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        if (_selectedPositionIndex.contains(index)) {
                          _selectedPositionIndex.remove(index);
                        } else {
                          _selectedPositionIndex.add(index);
                        }
                      });
                    },
                    child: ListTile(
                      title: Row(
                        children: [
                          Text(
                            _positions[index].printName,
                            style: TextStyle(
                              fontWeight: _selectedPositionIndex.contains(index)
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                          Spacer(),
                          CheckBubble(
                            isSelected: _selectedPositionIndex.contains(index),
                            bubbleColor: Color(0xFFB1947B),

                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            )
                : CircularProgressIndicator(),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFB1947B),
              ),
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
            : Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Welcome to Sched!',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFB1947B),
              ),
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TabsPage(), // Pass the user ID if needed
                  ),
                );
              },
              child: Text('Lets go!'),
            ),
          ],
        ),
      ),
    );
  }
}
