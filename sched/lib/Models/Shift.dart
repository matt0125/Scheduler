class Shift {
  final String rawDate;
  late final String date;
  final bool isWorking;
  late final String? unformattedDate;
  final String? startTime;
  final String? endTime;
  late String? positionTitle;
  late final String? printTime;

  Shift({
    required this.rawDate,
    required this.isWorking,
    this.startTime,
    this.endTime,
    this.positionTitle,
  }){
    this.unformattedDate = _formatDate2(this.rawDate);
    this.date = _formatDate(this.rawDate);
    if(this.isWorking) {
      setPrintTime();
      formatPositionTitle();
    }
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

  String setPrintTime() {
    if(this.startTime != null && this.endTime != null) {
      int startH = int.parse(this.startTime!.split(":")[0]);
      int endH = int.parse(this.endTime!.split(":")[0]);
      int startM = int.parse(this.startTime!.split(":")[1]);
      int endM = int.parse(this.endTime!.split(":")[1]);

      String startAM = startH < 12 ? "AM" : "PM";
      String endAM = endH < 12 ? "AM" : "PM";

      if(startH > 12)
        startH -= 12;
      if(endH > 12)
        endH -= 12;

      return this.printTime = "${startH}:${startM} ${startAM != endAM ? startAM : ""}- ${endH}:${endM} ${endAM}";
    }

    return "";
  }

  void formatPositionTitle() {
    List<String> ogWords = this.positionTitle!.split(" ");
    List<String> newWords = [];
    for(String word in ogWords)
    {
      newWords.add(word[0].toUpperCase() + word.substring(1).toLowerCase());
    }
    this.positionTitle = newWords.join(" ");
  }
}

