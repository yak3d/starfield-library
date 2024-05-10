import { graphql, useStaticQuery } from 'gatsby'
import React, { useEffect, useState } from 'react'
import * as JsSearch from 'js-search'

export const SearchContainer = () => {
    const gqlResults: GatsbyTypes.SfBooksSearchQuery = useStaticQuery(graphql`
    query SfBooksSearch {
        allSfBooksJson {
            edges {
                node {
                    editorId,
                    bookTitle,
                    bookText
                }
            }
        }
    }`)

    const data = gqlResults.allSfBooksJson.edges.map(edge => edge.node)

    console.log(data)
    const [bookList, setBookList] = useState<{
                readonly editorId: string | null
                readonly bookTitle: string | null
                readonly bookText: string | null;
            }[]>(data)
    const [search, setSearch] = useState<JsSearch.Search>()
    const [searchResults, setSearchResults] = useState<{
                readonly editorId: string | null
                readonly bookTitle: string | null
                readonly bookText: string | null;
            }[]>(data)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        setBookList(data)
        rebuildIndex()
    }, [])

    const rebuildIndex = () => {
        const dataToSearch = new JsSearch.Search("editorId")
        /**
         * defines an indexing strategy for the data
         * more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
         */
        dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
        /**
         * defines the sanitizer for the search
         * to prevent some of the words from being excluded
         *
         */
        dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
        /**
         * defines the search index
         * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
         */
        dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("editorId")

        dataToSearch.addIndex("bookTitle") // sets the index attribute for the data
        dataToSearch.addIndex("bookText") // sets the index attribute for the data

        dataToSearch.addDocuments(bookList) // adds the data to be searched
        setSearch(dataToSearch)
        setIsLoading(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault()

    const searchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const queryResult = search?.search(e.target.value)
        setSearchQuery(e.target.value)

        if (queryResult != null) {
            setSearchResults(queryResult)
        }
    }

    return (
    <>
        <div>
            <div style={{ margin: "0 auto" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ margin: "0 auto" }}>
                        <label htmlFor="Search" style={{ paddingRight: "10px" }}>
                            Enter your search here
                        </label>
                        <input
                            id="Search"
                            value={searchQuery}
                            onChange={searchData}
                            placeholder="Enter your search here"
                            style={{ margin: "0 auto", width: "400px" }}
                        />
                    </div>
                </form>
                <div>
                    Number of items:
                    {searchResults.length}
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            borderRadius: "4px",
                            border: "1px solid #d3d3d3",
                        }}
                    >
                        <thead style={{ border: "1px solid #808080" }}>
                            <tr>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "5px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        borderBottom: "2px solid #d3d3d3",
                                        cursor: "pointer",
                                    }}
                                >
                                    Book ISBN
                                </th>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "5px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        borderBottom: "2px solid #d3d3d3",
                                        cursor: "pointer",
                                    }}
                                >
                                    Book Title
                                </th>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "5px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        borderBottom: "2px solid #d3d3d3",
                                        cursor: "pointer",
                                    }}
                                >
                                    Book Author
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map(item => {
                                return (
                                    <tr key={`row_${item.editorId}`}>
                                        <td
                                            style={{
                                                fontSize: "14px",
                                                border: "1px solid #d3d3d3",
                                            }}
                                        >
                                            {item.editorId}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: "14px",
                                                border: "1px solid #d3d3d3",
                                            }}
                                        >
                                            {item.bookTitle}
                                        </td>
                                        <td
                                            style={{
                                                fontSize: "14px",
                                                border: "1px solid #d3d3d3",
                                            }}
                                        >
                                            {item.bookText}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
                    
}