import 'package:flutter/material.dart';
import '../Services/APIService.dart';
import '../Models/Employee.dart';
import '../Models/Position.dart';
import '../Widgets/popup.dart';
import '../tabs.dart';

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

  TextEditingController _verificationCodeController = TextEditingController();

  @override
  void initState() {
    super.initState();

    populateManagers();
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
        title: Text('Let\'s get started!'),
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
                ? Padding(
              padding: EdgeInsets.symmetric(horizontal: 40),
              child: TextField(
                controller: _verificationCodeController,
                maxLength: 6,
                textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: 'Enter verification code',
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: Colors.blue,
                      width: 2.0,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: Colors.black,
                      width: 1.0,
                    ),
                  ),
                ),
                onChanged: (value) {
                  // Handle the input
                },
              ),
            )
                : Container(),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFB1947B),
              ),
              onPressed: () async {
                // Verify email with the entered verification code
                final enteredCode = _verificationCodeController.text;
                final response = await apiService.verifyEmail(enteredCode);

                if (response.success!) {
                  // The verification code is correct, proceed to the next page
                  setState(() {
                    _firstPage = false;
                  });
                } else {
                  // The verification code is incorrect, show an error message or handle as needed
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text("Verification Error"),
                        content: Text("The entered verification code is incorrect. Please try again."),
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
                }
              },
              child: Text('Let\'s Go!'),
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
                  if ((await apiService.AssignManager( _managers[_selectedManagerIndex!].employeeId!)).success!) {
                    _positions = await apiService.GetManagerPositions(_managers[_selectedManagerIndex!].employeeId!);
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
                for(int i in _selectedPositionIndex) {
                  await apiService.AddPosition(_positions[i].id);
                }
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
