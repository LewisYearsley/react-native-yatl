import React, { useContext, useMemo } from "react"
import { TextStyle, ImageStyle, ViewStyle, StyleSheet } from "react-native"

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

export type Themed<TTheme, TThemeDictionary> = {
  createStylesheet: <T extends NamedStyles<T> | NamedStyles<any>>(
    stylesCallback: (theme: TTheme) => T | NamedStyles<T>
  ) => () => T
  ThemeProvider: React.FC<React.PropsWithChildren<{ themeName: keyof TThemeDictionary }>>
  useTheme: () => TTheme
  getTheme: (name: keyof TThemeDictionary) => TTheme
}

type InferThemeType<TThemeDictionary extends Record<string, object>> =
  TThemeDictionary extends Record<string, infer TTheme> ? TTheme : never

export const createYatl = <TThemeDictionary extends Record<string, object>>(
  themes: TThemeDictionary,
  initialTheme: keyof TThemeDictionary
): Themed<InferThemeType<TThemeDictionary>, TThemeDictionary> => {
  const ThemeContext = React.createContext({
    themeName: initialTheme,
    theme: themes[initialTheme],
  })

  function createStylesheet<T extends NamedStyles<T> | NamedStyles<any>>(
    stylesCallback: (theme: InferThemeType<TThemeDictionary>) => T | NamedStyles<T>
  ): () => T {
    const styles = Object.entries(themes).reduce(
      (sheets, [themeName, theme]) => {
        sheets[themeName as keyof TThemeDictionary] = StyleSheet.create(
          stylesCallback(theme as InferThemeType<TThemeDictionary>)
        ) as T

        return sheets
      },
      {} as Record<keyof TThemeDictionary, T>
    )

    return () => {
      const { themeName } = React.useContext(ThemeContext)

      return styles[themeName]
    }
  }

  return {
    ThemeProvider: ({ themeName, children }) => {
      const value = useMemo(
        () => ({
          themeName,
          theme: themes[themeName],
        }),
        [themeName]
      )

      return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    },
    createStylesheet,
    useTheme: () => useContext(ThemeContext).theme as InferThemeType<TThemeDictionary>,
    getTheme: (name) => themes[name] as InferThemeType<TThemeDictionary>,
  }
}
