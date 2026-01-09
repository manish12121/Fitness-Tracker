import React from "react";
import styled from "styled-components";
import { PieChart } from "@mui/x-charts/PieChart";


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

const CategoryChart = ({data}) => {
  return (
    <Card>
      <Title>Weekly Calories Burnt</Title>
      {data?.pieChartData && (
        <PieChart
          series={[{ data: data?.pieChartData,
            innerRadius: 20,
            paddingAngle: 2,
            cornerRadius: 2,
            outerRadius: 130,
           }]}
          height={300}
        />
      )}
    </Card>
  )
}

export default CategoryChart
