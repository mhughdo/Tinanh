import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';

const Settings = ({ isVisible = false, setIsVisible }: { isVisible: boolean; setIsVisible: Function }) => {
  const [distance, setDistance] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [gender, setGender] = useState('');

  const renderCustomAge = () => (
    <View style={styles.option}>
      <View style={styles.optionTitle}>
        <Text style={styles.optionText}>Age</Text>
        <Text style={styles.optionValue}>
          {minAge} - {maxAge}
        </Text>
      </View>
      <MultiSlider
        trackStyle={{ backgroundColor: '#bdc3c7', height: 5 }}
        selectedStyle={{ backgroundColor: '#eb5a6d' }}
        values={[minAge, maxAge]}
        sliderLength={normalize(280)}
        onValuesChange={([minAge, maxAge]) => {
          setMinAge(minAge);
          setMaxAge(maxAge);
        }}
        min={0}
        max={30}
        step={1}
        allowOverlap={false}
        snapped={true}
      />
    </View>
  );

  const renderCustomDistance = () => (
    <View style={styles.option}>
      <View style={styles.optionTitle}>
        <Text style={styles.optionText}>Distance</Text>
        <Text style={styles.optionValue}>{distance} km</Text>
      </View>
      <MultiSlider
        trackStyle={{ backgroundColor: '#bdc3c7', height: 5 }}
        selectedStyle={{ backgroundColor: '#eb5a6d' }}
        sliderLength={normalize(280)}
        values={[distance]}
        onValuesChange={([distance]) => {
          setDistance(distance);
        }}
        min={0}
        max={1000}
        step={1}
      />
    </View>
  );

  const renderCustomGender = () => (
    <View style={styles.option}>
      <Text style={styles.optionText}>Gender</Text>
      <View style={styles.gender}>
        {renderGenderItem('Female')}
        {renderGenderItem('Male')}
        {renderGenderItem('Shemale')}
      </View>
    </View>
  );

  const renderGenderItem = (option: string) => (
    <TouchableOpacity
      onPress={() => setGender(option)}
      style={gender === option ? styles.selectedGenderItem : styles.genderItem}>
      <Text style={gender === option ? styles.selectedGenderText : styles.genderText}>{option}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Modal isVisible={isVisible} backdropOpacity={0.1}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Ionicons name="ios-close" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Ionicons name="ios-checkmark" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View>
            {renderCustomAge()}
            {renderCustomGender()}
            {renderCustomDistance()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#ffffff',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(25),
    borderRadius: normalize(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(20),
    fontWeight: '600',
  },
  icon: {
    fontSize: normalize(40),
  },
  text: {
    fontSize: normalize(15),
  },
  option: {
    paddingVertical: normalize(10),
  },
  optionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#eb5a6d',
  },
  optionValue: {
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  gender: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: '#a09c9b',
    borderWidth: 1,
    borderRadius: normalize(10),
    marginTop: normalize(15),
  },
  selectedGenderItem: {
    backgroundColor: '#eb5a6d',
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    width: '33%',
  },
  genderItem: {
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    width: '33%',
  },
  genderText: {
    textAlign: 'center',
    fontSize: normalize(15),
    fontWeight: '500',
  },
  selectedGenderText: {
    textAlign: 'center',
    fontSize: normalize(15),
    fontWeight: '500',
    color: '#ffffff',
  },
});
