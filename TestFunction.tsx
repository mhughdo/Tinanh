import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TestFunction = () => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(true);
  useEffect(() => {
    firestore()
      .collection('users')
      .doc('pNBgGRKMNgWpQAQSTL25')
      .get()
      .then((documentSnapshot) => {
        setText(documentSnapshot.data().name);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
};

export default TestFunction;
