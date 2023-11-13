class Shift {
  final String rawDate;
  late final String date;
  final bool isWorking;
  late final String? unformattedDate;
  final String? startTime;
  final String? endTime;
  final String? positionTitle;

  Shift({
    required this.rawDate,
    required this.isWorking,
    this.startTime,
    this.endTime,
    this.positionTitle,
  }){
    this.unformattedDate = _formatDate2(this.rawDate);
    this.date = _formatDate(this.rawDate);
  }

  static String _formatDate(String dateString) {
    DateTime date = DateTime.parse(dateString);
    String formattedDate = "${_getMonthName(date.month)} ${date.day}, ${date.year}";
    return formattedDate;
  }

  static String _formatDate2(String dateString) {
    DateTime date = DateTime.parse(dateString);
    String formattedDate = "${(date.month).toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}-${date.year}";
    return formattedDate;
  }

  static String _getMonthName(int month) {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
}

