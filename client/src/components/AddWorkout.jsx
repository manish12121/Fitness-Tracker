import React from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";

const Card = styled.div`
  flex: 1;
  padding: 24px;
  border-radius: 14px;
  min-width: 280px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const AddWorkout = ({workout, setWorkout, addNewWorkouts, buttonLoading}) => {
  return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
        placeholder={`Enter inn this formate :
        #Category
        -Workout Name
        -Sets
        -Reps
        -Weight (in kg)
        -Duration (in mins)`}
        textArea
        rows={10}
        value={workout}
        handleChange={(e) => setWorkout(e.target.value)}
      />
      <Button t
      text="Add Workout" 
      small 
      onClick={()=> addNewWorkouts()}
      isLoading={buttonLoading}
      isDisabled={buttonLoading}
      />
    </Card>
  );
};

export default AddWorkout;
