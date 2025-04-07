declare module '@react-native-community/datetimepicker' {
  import { ViewProps } from 'react-native';

  export interface DateTimePickerEvent {
    type: string;
    nativeEvent: {
      timestamp: number;
    };
  }

  export interface DateTimePickerProps extends ViewProps {
    value: Date;
    mode?: 'date' | 'time' | 'datetime';
    display?: 'default' | 'spinner' | 'clock' | 'calendar';
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    minuteInterval?: number;
    timeZoneOffsetInMinutes?: number;
    testID?: string;
  }

  const DateTimePicker: React.ComponentType<DateTimePickerProps>;
  export default DateTimePicker;
} 