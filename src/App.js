import React, { Component } from 'react';
import './App.css';

const incomesAPI = 'https://recruitment.hal.skygate.io/incomes/';
class App extends Component {

  state = {
    rows: 20,
    loading: true,
    sorted: 'none',
    headers: [
      { value: 'ID' },
      { value: 'Name' },
      { value: 'City' },
      { value: 'Total Income' },
      { value: 'Average Income' },
      { value: 'Last Month Income' },
    ],
    companiesIncomes: {
      totalIncomes: [],
      averageIncomes: [],
      lastMonthIncomes: [],
    },
    finalData: [],
    originalData: [],

    ids: [],
    idsRev: [],
    cities: [],
    names: [],
    totals: [],
    average: [],
    lastMonth: [],

    id: 205,
    index: 0,
    dataIndex: 0,
  }




  async componentDidMount() {
    const getCompaniesNames = async () => {
      try {
        const companiesDetails = 'https://recruitment.hal.skygate.io/companies';
        const detailsResponse = await fetch(companiesDetails);
        const detailsData = detailsResponse.json().then(detailsData => {

          this.setState({

            finalData: detailsData,

            id: detailsData[this.state.index].id,


          })


        })




        this.setState({
          loading: false,
        })

        return detailsData
      } catch (err) {
        console.log(err)
      }
    }
    const getCompaniesIncomes = async (id) => {
      try {
        const incomesResponse = await fetch(`${incomesAPI}${id}`);
        const incomesData = incomesResponse.json().then(incomesData => {
          const newIncomes = [...incomesData.incomes];

          const summed = incomesData.incomes.map((income, index) => parseInt(income.value)).reduce((a, b) => a + b, 0);

          const averageLength = incomesData.incomes.map((income, index) => parseInt(income.value)).length;

          const average = summed / averageLength;

          const lastMonthValidation = newIncomes.map((company, index) => (company.date.match(/-12-/) ? company.value : 0));
          const lastMonthParse = lastMonthValidation.map(deal => parseInt(deal));
          const lastmonthSum = lastMonthParse.reduce((a, b) => a + b, 0);

          return (
            this.state.companiesIncomes.totalIncomes.push(summed),
            this.state.companiesIncomes.averageIncomes.push(average),
            this.state.companiesIncomes.lastMonthIncomes.push(lastmonthSum)

          )
        })




        return incomesData
      } catch (err) {
        console.log(err)
      }
    }



    const getAllData = setInterval(() => {
      if (this.state.index < this.state.finalData.length) {
        getCompaniesIncomes(this.state.id)
        this.setState({
          id: this.state.finalData[this.state.index].id,
          index: this.state.index + 1
        })
        console.log('hey #1')
      } else if (this.state.index = this.state.finalData.length && this.state.index < this.state.finalData.length + 1) {
        console.log('hey #2')
        this.sortDatas()
        clearInterval(getAllData)
        this.setState({
          originalData: [...this.state.finalData]
        })

      }
    }, 0)


    getCompaniesNames()


  }



  createCompanySet = () => {


    this.state.finalData.map((company, index) => {
      return (company.total = this.state.companiesIncomes.totalIncomes[index],
        company.average = this.state.companiesIncomes.averageIncomes[index],
        company.lastMonth = this.state.companiesIncomes.lastMonthIncomes[index])

    })



  }



  sortDatas = () => {

    const FinalDataIDS = [...this.state.finalData];
    const sortedByID = FinalDataIDS.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    const sortedByIDRev = [...sortedByID].reverse()





    const FinalDataNames = [...this.state.finalData];
    const sortedByName = FinalDataNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    const sortedByNameRev = [...sortedByName].reverse()


    const FinalDataCity = [...this.state.finalData];
    const sortedByCity = FinalDataCity.sort((a, b) => (a.city > b.city) ? 1 : ((b.city > a.city) ? -1 : 0))
    const sortedByCityRev = [...sortedByCity].reverse()

    const FinalDataTotal = [...this.state.finalData];
    const sortedByTotal = FinalDataTotal.sort((a, b) => (a.total > b.total) ? 1 : ((b.total > a.total) ? -1 : 0))
    const sortedByTotalRev = [...sortedByTotal].reverse()

    const FinalDataAverage = [...this.state.finalData];
    const sortedByAverage = FinalDataAverage.sort((a, b) => (a.average > b.average) ? 1 : ((b.average > a.average) ? -1 : 0))
    const sortedByAverageRev = [...sortedByAverage].reverse()


    const FinalDataLastMonth = [...this.state.finalData];
    const sortedByLastMonth = FinalDataLastMonth.sort((a, b) => (a.lastMonth > b.lastMonth) ? 1 : ((b.lastMonth > a.lastMonth) ? -1 : 0))
    const sortedByLastMonthRev = [...sortedByLastMonth].reverse()


    console.log(this.state.finalData)
    this.setState({

      ids: sortedByID,
      idsRev: sortedByIDRev,
      names: sortedByName,
      namesRev: sortedByNameRev,
      cities: sortedByCity,
      citiesRev: sortedByCityRev,
      totals: sortedByTotal,
      totalsRev: sortedByTotalRev,
      average: sortedByAverage,
      averageRev: sortedByAverageRev,
      lastMonth: sortedByLastMonth,
      lastMonthRev: sortedByLastMonthRev


    })
    console.log(this.state.ids)
    console.log(this.state.names)
    console.log(this.state.cities)
    console.log(this.state.totals)
    console.log(this.state.average)
    console.log(this.state.lastMonth)
  }








  getHeaders = () => {
    const headers = this.state.headers.map((header, index) => <th key={index} sorted={this.state.sorted} onClick={this.handleSort} className={`table_header ${header.value}`}>{header.value}</th>)
    return headers
  }
  handleNextPage = () => {
    if (this.state.dataIndex < this.state.finalData.length - 20) {
      this.setState({
        dataIndex: this.state.dataIndex + 20,
      })
    }
  }
  handlePreviousPage = () => {
    if (this.state.dataIndex > 0) {
      this.setState({
        dataIndex: this.state.dataIndex - 20,
      })
    }
  }

  handleSort = () => {
    const header = document.querySelectorAll('th');

    header[0].addEventListener('click', () => {

      if (this.state.sorted === 'none') {
        this.setState({
          sorted: 'asc',
          finalData: this.state.ids
        })
      } else if (this.state.sorted === 'asc') {
        this.setState({
          sorted: 'desc',
          finalData: this.state.idsRev
        })
      } else if (this.state.sorted === 'desc') {
        this.setState({
          sorted: 'none',
          finalData: this.state.originalData
        })
      }
    })

    header[1].addEventListener('click', () => {
      if (this.state.sorted === 'none') {
        this.setState({
          sorted: 'asc',
          finalData: this.state.names
        })
      }
      else if (this.state.sorted === 'asc') {
        this.setState({
          sorted: 'desc',
          finalData: this.state.namesRev
        })
      }
      else if (this.state.sorted === 'desc') {
        this.setState({
          sorted: 'none',
          finalData: this.state.originalData
        })
      }
    })

    header[2].addEventListener('click', () => {
      if (this.state.sorted === 'none') {
        this.setState({
          sorted: 'asc',
          finalData: this.state.cities
        })
      }
      else if (this.state.sorted === 'asc') {
        this.setState({
          sorted: 'desc',
          finalData: this.state.citiesRev
        })
      }
      else if (this.state.sorted === 'desc') {
        this.setState({
          sorted: 'none',
          finalData: this.state.originalData
        })
      }
    })
    header[3].addEventListener('click', () => {
      if (this.state.sorted === 'none') {
        this.setState({
          sorted: 'asc',
          finalData: this.state.totals
        })
      }
      else if (this.state.sorted === 'asc') {
        this.setState({
          sorted: 'desc',
          finalData: this.state.totalsRev
        })
      }
      else if (this.state.sorted === 'desc') {
        this.setState({
          sorted: 'none',
          finalData: this.state.originalData
        })
      }
    })

    header[4].addEventListener('click', () => {
      if (this.state.sorted === 'none') {
        this.setState({
          sorted: 'asc',
          finalData: this.state.average
        })
      }
      else if (this.state.sorted === 'asc') {
        this.setState({
          sorted: 'desc',
          finalData: this.state.averageRev
        })
      }
      else if (this.state.sorted === 'desc') {
        this.setState({
          sorted: 'none',
          finalData: this.state.originalData
        })
      }
    })


    header[5].addEventListener('click', () => {
      if (this.state.sorted === 'none') {
        this.setState({
          sorted: 'asc',
          finalData: this.state.lastMonth
        })
      }
      else if (this.state.sorted === 'asc') {
        this.setState({
          sorted: 'desc',
          finalData: this.state.lastMonthRev
        })
      }
      else if (this.state.sorted === 'desc') {
        this.setState({
          sorted: 'none',
          finalData: this.state.originalData
        })
      }
    })


  }


  render() {

    return (
      < div >
        {this.createCompanySet()}

        {
          this.state.loading ?
            <div className='loadingText'>Loading datas...</div> :
            <div className='headerText'>Recruitment Task - Table of Companies details and incomes. </div>
        }

        < input type="text" className='filterInput' />
        <div className='tableSwitchers'>

          <button className="button nextPage" onClick={this.handleNextPage}> &rarr; </button>
          <button className="button previousPage" onClick={this.handlePreviousPage}>&larr;</button>
        </div>
        <table className='table'>
          <thead>
            <tr className='table_row'>
              {this.getHeaders()}
            </tr>
          </thead>
          <tbody>
            {(this.state.finalData.length > 0) ? this.state.finalData.map((data, index) => {
              if (index < 20) {
                return (
                  <tr key={index} className='table_row'>
                    <td className='table_data'> {this.state.finalData[this.state.dataIndex + index].id}</td>
                    <td className='table_data'>{this.state.finalData[this.state.dataIndex + index].name}</td>
                    <td className='table_data'>{this.state.finalData[this.state.dataIndex + index].city}</td>
                    <td className='table_data'>{this.state.finalData[this.state.dataIndex + index].total}</td>
                    <td className='table_data'>{this.state.finalData[this.state.dataIndex + index].average}</td>
                    <td className='table_data'>{this.state.finalData[this.state.dataIndex + index].lastMonth}</td>
                  </tr>
                )
              }
            })
              : <tr><td className='table_data'>Loading...</td></tr>}



          </tbody>
        </table>


      </div >



    );
  }
}

export default App;