import { Component } from '@angular/core';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent  {

  nanoSnippet: string = `
  #include &lsaquo;TinyGPS++.h&rsaquo;
  #include &lsaquo;SoftwareSerial.h&rsaquo;
  #include &lsaquo;SPI.h&rsaquo;
  #include &lsaquo;SD.h&rsaquo;

  static const int RXPin = 4, TXPin = 3;
  static const uint32_t GPSBaud = 9600;
  
  const int chipSelect = 10;      //SD card
  
  TinyGPSPlus gps;      //TinyGPS++ object
  
  SoftwareSerial ss(RXPin, TXPin);      //Serial connection to the GPS device
  
  void setup()
  {
    Serial.begin(115200);
    ss.begin(GPSBaud);
  
    if (!SD.begin(chipSelect)) {
      while (1);
    }
  }
  
  void loop()
  {
    while (ss.available() > 0)
      if (gps.encode(ss.read()))
        displayInfo();
  
    if (millis() > 5000 && gps.charsProcessed() < 10)
    {
      Serial.println(F("No GPS detected: check wiring."));
      while (true);
    }
    delay(100);
  }
  
  void displayInfo()
  {
    String dataString = "";

    Serial.print(F("Location: "));
    dataString="Location: ";
    
    if (gps.location.isValid())
    {
      Serial.print(gps.location.lat(), 6); 
      dataString=dataString+printFloat(gps.location.lat(), 6);
      
      Serial.print(F(","));
      dataString=dataString+",";

      Serial.print(gps.location.lng(), 6); 
      dataString=dataString+printFloat(gps.location.lng(), 6);
    }

    else
    {
      Serial.print(F("INVALID"));
      dataString=dataString+"INVALID";
    }
  
    Serial.print(F("  Date/Time: "));
    dataString=dataString+"  Date/Time: ";

    if (gps.date.isValid())
    {
      Serial.print(gps.date.month());
      dataString=dataString+String(gps.date.month());

      Serial.print(F("/")); 
      dataString=dataString+"/";

      Serial.print(gps.date.day());
      dataString=dataString+String(gps.date.day());

      Serial.print(F("/"));
      dataString=dataString+"/";

      Serial.print(gps.date.year());
      dataString=dataString+String(gps.date.year());
    }

    else
    {
      Serial.print(F("INVALID"));
      dataString=dataString+"INVALID";
    }
  
    Serial.print(F(" "));
    dataString=dataString+" ";

    if (gps.time.isValid())
    {
      if (gps.time.hour() < 10){
        Serial.print(F("0"));
        dataString=dataString+"0";
      }

      Serial.print(gps.time.hour());
      dataString=dataString+String(gps.time.hour());

      Serial.print(F(":"));
      dataString=dataString+":";

      if (gps.time.minute() < 10){
        Serial.print(F("0"));
        dataString=dataString+"0";
      }

      Serial.print(gps.time.minute());
      dataString=dataString+String(gps.time.minute());

      Serial.print(F(":"));
      dataString=dataString+":";

      if (gps.time.second() < 10){
        Serial.print(F("0"));
        dataString=dataString+"0";
      }

      Serial.print(gps.time.second());
      dataString=dataString+String(gps.time.second());

      Serial.print(F("."));
      dataString=dataString+".";

      if (gps.time.centisecond() < 10){
        Serial.print(F("0"));
        dataString=dataString+"0";
      }

      Serial.print(gps.time.centisecond());
      dataString=dataString+String(gps.time.centisecond());
    }

    else
    {
      Serial.print(F("INVALID"));
    }
  
  
    //---------------------------------------------------------------------------------------
    File dataFile = SD.open("datalog.txt", FILE_WRITE);
  
    // if the file is available, write to it:
    if (dataFile) {
      dataFile.println(dataString);
      dataFile.close();
    }
    // if the file isn't open, pop up an error:
    else {
      Serial.println("error opening datalog.txt");
    }
    //---------------------------------------------------------------------------------------
  
  
    Serial.println();
  }
  
  
  
  String printFloat(double number, uint8_t digits) 
  { 
    String result;
    String prefix;
    // Handle negative numbers
    if (number < 0.0)
    {
       prefix = "-";
       number = -number;
    }
    result += prefix;
  
    // Round correctly so that print(1.999, 2) prints as "2.00"
    double rounding = 0.5;
    for (uint8_t i=0; i<digits; ++i)
      rounding /= 10.0;
    
    number += rounding;
  
    // Extract the integer part of the number
    unsigned long int_part = (unsigned long)number;
    double remainder = number - (double)int_part;
    result += int_part;
  
    // Print the decimal point, but only if there are digits beyond
    if (digits > 0)
      result += "."; 
  
    // Extract digits from the remainder one at a time
    while (digits-- > 0)
    {
      remainder *= 10.0;
      int toPrint = int(remainder);
      result += toPrint;
      remainder -= toPrint; 
    } 
  
    return result;
  }
          `;

}
