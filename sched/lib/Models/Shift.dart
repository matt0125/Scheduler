class Shift {
  final String? date;
  final String? startTime;
  final String? endTime;
  final String? positionTitle;

  Shift({
    this.date,
    this.startTime,
    this.endTime,
    this.positionTitle,
  });

  factory Shift.fromJson(dynamic json){
    return Shift(
      date: json['date'] as String,
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String,
      positionTitle: json['positionTitle'] as String
    );
  }

  static List<Shift> shiftsFromSnapshot(List snapshot)
  {
    return snapshot.map(
        (data){
          return Shift.fromJson(data);
        }
    ).toList();
  }

  static String formatDate(String dateString) {
    DateTime date = DateTime.parse(dateString);
    String formattedDate = "${_getMonthName(date.month)} ${date.day}, ${date.year}";
    return formattedDate;
  }

  static String _getMonthName(int month) {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
}