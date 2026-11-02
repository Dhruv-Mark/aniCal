
import React, {useEffect, useState} from 'react';
import {
  View, Text, Button, FlatList, StyleSheet, Alert,
  ActivityIndicator, TextInput
} from 'react-native';

export default function App(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=10'
      );

      const data = await response.json();
      setPosts(data);
    } 
    catch (error){
      Alert.alert('Error', 'Failed to fetch data');
    }
    finally {
      setLoading(false);
    }
  };

  const sendData = async () => {
    if (title.trim() === '' || body.trim() === ''){
      Alert.alert('Error', 'Please enter both title and text');
      return;
    }

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            title: title,
            body: body,
            userId: 1
          })
        }
      );

      const data = await response.json();

      Alert.alert('Success', 'Data sent! ID: ' + data.id);

      // Display the submitted post in the list
      setPosts((previousPosts) => [
        {
          id: data.id,
          title: title,
          body: body
        },
        ...previousPosts
      ]);

      setTitle('');
      setBody('');
    } 
    catch (error) {
      Alert.alert('Error', 'Failed to send data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>REST API Demo</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter post title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your text"
        value={body}
        onChangeText={setBody}
        multiline
      />

      <Button
        title="Send Data"
        onPress={sendData}
      />

      <View style={styles.space} />

      <Button
        title="Fetch Data"
        onPress={fetchData}
      />

      {loading && <ActivityIndicator size="large" />}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.title}
            </Text>
            <Text>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderColor: '#999999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  space: {
    height: 10
  },

  card: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 5
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16
  }
});