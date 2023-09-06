import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import Images from './constant/Images';

interface Task {
  text: string;
  done: boolean;
}

/**
 * @author Adeet Tuladhar
 * @function @App
 **/

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, {text: newTask, done: false}]);
      setNewTask('');
    }
  };

  const startEditingTask = (index: number) => {
    setEditIndex(index);
    setEditedTask(tasks[index].text);
  };

  const doneEditingTask = () => {
    setEditIndex(null);
    setEditedTask('');
  };

  const deleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setEditIndex(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>To-Do List</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          value={newTask}
          onChangeText={text => setNewTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
        {tasks.length === 0 ? (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.noTasksText}>No tasks to be display</Text>
            <Image source={Images.notask}/>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.taskItem}>
                <View style={{flex: 2}}>
                  {editIndex === index ? (
                    <View style={styles.editTask}>
                      <TextInput
                        style={styles.editInput}
                        value={editedTask}
                        onChangeText={text => setEditedTask(text)}
                      />
                      <Button title="Done" onPress={doneEditingTask} />
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => startEditingTask(index)}>
                      <CheckBox
                        checkBoxColor="darkcyan"
                        isChecked={item.done}
                        onClick={() => {
                          const updatedTasks = [...tasks];
                          updatedTasks[index].done = !updatedTasks[index].done;
                          setTasks(updatedTasks);
                        }}
                      />
                      <Text
                        style={item.done ? styles.taskDone : styles.taskText}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    title="Edit"
                    onPress={() => startEditingTask(index)}
                    disabled={editIndex === index || item.done}
                  />

                  <Button
                    title="Delete"
                    onPress={() => deleteTask(index)}
                    color="red"
                    disabled={editIndex === index}
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  mainContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: 'darkcyan',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  editTask: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskDone: {
    flex: 1,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',

  },
  noTasksText: {
    fontSize: 22,
    fontWeight:"bold",
    textAlign: 'center',
    margin: 20,
  },
});

export default App;
