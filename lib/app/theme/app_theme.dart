import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const String fontFamily = 'Inter';
  
  // Color Palette
  static const Color primaryColor = Color(0xFF6366F1);
  static const Color primaryVariant = Color(0xFF4F46E5);
  static const Color secondaryColor = Color(0xFF10B981);
  static const Color secondaryVariant = Color(0xFF059669);
  static const Color backgroundColor = Color(0xFFF8FAFC);
  static const Color surfaceColor = Color(0xFFFFFFFF);
  static const Color errorColor = Color(0xFFEF4444);
  static const Color warningColor = Color(0xFFF59E0B);
  static const Color successColor = Color(0xFF10B981);
  static const Color infoColor = Color(0xFF3B82F6);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textDisabled = Color(0xFF9CA3AF);
  
  // Border Colors
  static const Color borderColor = Color(0xFFE5E7EB);
  static const Color borderColorDark = Color(0xFFD1D5DB);
  
  // Shadow Colors
  static const Color shadowColor = Color(0x1A000000);

  // Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      fontFamily: fontFamily,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        onPrimary: Colors.white,
        primaryContainer: Color(0xFFEEF2FF),
        onPrimaryContainer: Color(0xFF1E1B4B),
        secondary: secondaryColor,
        onSecondary: Colors.white,
        secondaryContainer: Color(0xFFD1FAE5),
        onSecondaryContainer: Color(0xFF064E3B),
        tertiary: Color(0xFF8B5CF6),
        onTertiary: Colors.white,
        error: errorColor,
        onError: Colors.white,
        surface: surfaceColor,
        onSurface: textPrimary,
        surfaceContainerHighest: Color(0xFFF1F5F9),
        onSurfaceVariant: textSecondary,
        outline: borderColor,
        outlineVariant: Color(0xFFF1F5F9),
      ),
      textTheme: _buildTextTheme(),
      elevatedButtonTheme: _buildElevatedButtonTheme(),
      outlinedButtonTheme: _buildOutlinedButtonTheme(),
      textButtonTheme: _buildTextButtonTheme(),
      filledButtonTheme: _buildFilledButtonTheme(),
      inputDecorationTheme: _buildInputDecorationTheme(),
      cardTheme: _buildCardTheme(),
      appBarTheme: _buildAppBarTheme(),
      bottomNavigationBarTheme: _buildBottomNavigationBarTheme(),
      floatingActionButtonTheme: _buildFloatingActionButtonTheme(),
      chipTheme: _buildChipTheme(),
      dialogTheme: _buildDialogTheme(),
      snackBarTheme: _buildSnackBarTheme(),
      dividerTheme: _buildDividerTheme(),
      tabBarTheme: _buildTabBarTheme(),
      bottomSheetTheme: _buildBottomSheetTheme(),
      navigationBarTheme: _buildNavigationBarTheme(),
      listTileTheme: _buildListTileTheme(),
      switchTheme: _buildSwitchTheme(),
      checkboxTheme: _buildCheckboxTheme(),
      radioTheme: _buildRadioTheme(),
      sliderTheme: _buildSliderTheme(),
      progressIndicatorTheme: _buildProgressIndicatorTheme(),
    );
  }

  // Dark Theme
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      fontFamily: fontFamily,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        onPrimary: Colors.white,
        primaryContainer: Color(0xFF312E81),
        onPrimaryContainer: Color(0xFFEEF2FF),
        secondary: secondaryColor,
        onSecondary: Colors.white,
        secondaryContainer: Color(0xFF065F46),
        onSecondaryContainer: Color(0xFFD1FAE5),
        tertiary: Color(0xFF8B5CF6),
        onTertiary: Colors.white,
        error: errorColor,
        onError: Colors.white,
        surface: Color(0xFF1E293B),
        onSurface: Color(0xFFF1F5F9),
        surfaceContainerHighest: Color(0xFF334155),
        onSurfaceVariant: Color(0xFFCBD5E1),
        outline: Color(0xFF475569),
        outlineVariant: Color(0xFF334155),
      ),
      textTheme: _buildTextTheme(isDark: true),
      elevatedButtonTheme: _buildElevatedButtonTheme(isDark: true),
      outlinedButtonTheme: _buildOutlinedButtonTheme(isDark: true),
      textButtonTheme: _buildTextButtonTheme(isDark: true),
      filledButtonTheme: _buildFilledButtonTheme(isDark: true),
      inputDecorationTheme: _buildInputDecorationTheme(isDark: true),
      cardTheme: _buildCardTheme(isDark: true),
      appBarTheme: _buildAppBarTheme(isDark: true),
      bottomNavigationBarTheme: _buildBottomNavigationBarTheme(isDark: true),
      floatingActionButtonTheme: _buildFloatingActionButtonTheme(isDark: true),
      chipTheme: _buildChipTheme(isDark: true),
      dialogTheme: _buildDialogTheme(isDark: true),
      snackBarTheme: _buildSnackBarTheme(isDark: true),
      dividerTheme: _buildDividerTheme(isDark: true),
      tabBarTheme: _buildTabBarTheme(isDark: true),
      bottomSheetTheme: _buildBottomSheetTheme(isDark: true),
      navigationBarTheme: _buildNavigationBarTheme(isDark: true),
      listTileTheme: _buildListTileTheme(isDark: true),
      switchTheme: _buildSwitchTheme(isDark: true),
      checkboxTheme: _buildCheckboxTheme(isDark: true),
      radioTheme: _buildRadioTheme(isDark: true),
      sliderTheme: _buildSliderTheme(isDark: true),
      progressIndicatorTheme: _buildProgressIndicatorTheme(isDark: true),
    );
  }

  // Text Theme
  static TextTheme _buildTextTheme({bool isDark = false}) {
    final Color textColor = isDark ? const Color(0xFFF1F5F9) : textPrimary;
    final Color secondaryTextColor = isDark ? const Color(0xFFCBD5E1) : textSecondary;
    
    return GoogleFonts.interTextTheme().copyWith(
      displayLarge: GoogleFonts.inter(
        fontSize: 57,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.25,
        color: textColor,
      ),
      displayMedium: GoogleFonts.inter(
        fontSize: 45,
        fontWeight: FontWeight.w400,
        letterSpacing: 0,
        color: textColor,
      ),
      displaySmall: GoogleFonts.inter(
        fontSize: 36,
        fontWeight: FontWeight.w400,
        letterSpacing: 0,
        color: textColor,
      ),
      headlineLarge: GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.w600,
        letterSpacing: 0,
        color: textColor,
      ),
      headlineMedium: GoogleFonts.inter(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        letterSpacing: 0,
        color: textColor,
      ),
      headlineSmall: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        letterSpacing: 0,
        color: textColor,
      ),
      titleLarge: GoogleFonts.inter(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        letterSpacing: 0,
        color: textColor,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.15,
        color: textColor,
      ),
      titleSmall: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
        color: textColor,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.5,
        color: textColor,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.25,
        color: textColor,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.4,
        color: secondaryTextColor,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.1,
        color: textColor,
      ),
      labelMedium: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.5,
        color: textColor,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.5,
        color: secondaryTextColor,
      ),
    );
  }

  // Component Themes
  static ElevatedButtonThemeData _buildElevatedButtonTheme({bool isDark = false}) {
    return ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 2,
        shadowColor: shadowColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        minimumSize: const Size(0, 48),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    );
  }

  static OutlinedButtonThemeData _buildOutlinedButtonTheme({bool isDark = false}) {
    return OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        minimumSize: const Size(0, 48),
        side: const BorderSide(color: borderColor, width: 1.5),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    );
  }

  static TextButtonThemeData _buildTextButtonTheme({bool isDark = false}) {
    return TextButtonThemeData(
      style: TextButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        minimumSize: const Size(0, 40),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    );
  }

  static FilledButtonThemeData _buildFilledButtonTheme({bool isDark = false}) {
    return FilledButtonThemeData(
      style: FilledButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        minimumSize: const Size(0, 48),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    );
  }

  static InputDecorationTheme _buildInputDecorationTheme({bool isDark = false}) {
    return InputDecorationTheme(
      filled: true,
      fillColor: isDark ? const Color(0xFF334155) : const Color(0xFFF8FAFC),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: borderColor, width: 1),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: borderColor, width: 1),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: errorColor, width: 1),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: errorColor, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      hintStyle: GoogleFonts.inter(
        color: isDark ? const Color(0xFF94A3B8) : textSecondary,
        fontSize: 14,
        fontWeight: FontWeight.w400,
      ),
      labelStyle: GoogleFonts.inter(
        color: isDark ? const Color(0xFFCBD5E1) : textPrimary,
        fontSize: 14,
        fontWeight: FontWeight.w500,
      ),
    );
  }

  static CardThemeData _buildCardTheme({bool isDark = false}) {
    return CardThemeData(
      elevation: 4,
      shadowColor: shadowColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: isDark ? const Color(0xFF1E293B) : surfaceColor,
      margin: const EdgeInsets.all(8),
    );
  }

  static AppBarTheme _buildAppBarTheme({bool isDark = false}) {
    return AppBarTheme(
      elevation: 0,
      centerTitle: true,
      backgroundColor: isDark ? const Color(0xFF0F172A) : backgroundColor,
      foregroundColor: isDark ? const Color(0xFFF1F5F9) : textPrimary,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: isDark ? const Color(0xFFF1F5F9) : textPrimary,
      ),
      iconTheme: IconThemeData(
        color: isDark ? const Color(0xFFF1F5F9) : textPrimary,
        size: 24,
      ),
      actionsIconTheme: IconThemeData(
        color: isDark ? const Color(0xFFF1F5F9) : textPrimary,
        size: 24,
      ),
    );
  }

  static BottomNavigationBarThemeData _buildBottomNavigationBarTheme({bool isDark = false}) {
    return BottomNavigationBarThemeData(
      backgroundColor: isDark ? const Color(0xFF1E293B) : surfaceColor,
      selectedItemColor: primaryColor,
      unselectedItemColor: isDark ? const Color(0xFF94A3B8) : textSecondary,
      selectedLabelStyle: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w600,
      ),
      unselectedLabelStyle: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
      ),
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    );
  }

  static FloatingActionButtonThemeData _buildFloatingActionButtonTheme({bool isDark = false}) {
    return FloatingActionButtonThemeData(
      backgroundColor: primaryColor,
      foregroundColor: Colors.white,
      elevation: 6,
      shape: const CircleBorder(),
    );
  }

  static ChipThemeData _buildChipTheme({bool isDark = false}) {
    return ChipThemeData(
      backgroundColor: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
      selectedColor: primaryColor.withOpacity(0.12),
      secondarySelectedColor: secondaryColor.withOpacity(0.12),
      labelStyle: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: isDark ? const Color(0xFFF1F5F9) : textPrimary,
      ),
      secondaryLabelStyle: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: secondaryColor,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    );
  }

  static DialogThemeData _buildDialogTheme({bool isDark = false}) {
    return DialogThemeData(
      backgroundColor: isDark ? const Color(0xFF1E293B) : surfaceColor,
      elevation: 24,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      titleTextStyle: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: isDark ? const Color(0xFFF1F5F9) : textPrimary,
      ),
      contentTextStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: isDark ? const Color(0xFFCBD5E1) : textSecondary,
      ),
    );
  }

  static SnackBarThemeData _buildSnackBarTheme({bool isDark = false}) {
    return SnackBarThemeData(
      backgroundColor: isDark ? const Color(0xFF374151) : const Color(0xFF1F2937),
      contentTextStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: Colors.white,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      behavior: SnackBarBehavior.floating,
      elevation: 6,
    );
  }

  static DividerThemeData _buildDividerTheme({bool isDark = false}) {
    return DividerThemeData(
      color: isDark ? const Color(0xFF475569) : borderColor,
      thickness: 1,
      space: 1,
    );
  }

  static TabBarThemeData _buildTabBarTheme({bool isDark = false}) {
    return TabBarThemeData(
      labelColor: primaryColor,
      unselectedLabelColor: isDark ? const Color(0xFF94A3B8) : textSecondary,
      labelStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
      ),
      unselectedLabelStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
      ),
      indicator: UnderlineTabIndicator(
        borderSide: const BorderSide(color: primaryColor, width: 2),
        insets: const EdgeInsets.symmetric(horizontal: 16),
      ),
      indicatorSize: TabBarIndicatorSize.tab,
    );
  }

  static BottomSheetThemeData _buildBottomSheetTheme({bool isDark = false}) {
    return BottomSheetThemeData(
      backgroundColor: isDark ? const Color(0xFF1E293B) : surfaceColor,
      modalBackgroundColor: isDark ? const Color(0xFF1E293B) : surfaceColor,
      elevation: 16,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      clipBehavior: Clip.antiAliasWithSaveLayer,
    );
  }

  static NavigationBarThemeData _buildNavigationBarTheme({bool isDark = false}) {
    return NavigationBarThemeData(
      backgroundColor: isDark ? const Color(0xFF1E293B) : surfaceColor,
      indicatorColor: primaryColor.withOpacity(0.12),
      elevation: 8,
      height: 80,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: primaryColor,
          );
        }
        return GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: isDark ? const Color(0xFF94A3B8) : textSecondary,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const IconThemeData(color: primaryColor, size: 24);
        }
        return IconThemeData(
          color: isDark ? const Color(0xFF94A3B8) : textSecondary,
          size: 24,
        );
      }),
    );
  }

  static ListTileThemeData _buildListTileTheme({bool isDark = false}) {
    return ListTileThemeData(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      titleTextStyle: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: isDark ? const Color(0xFFF1F5F9) : textPrimary,
      ),
      subtitleTextStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: isDark ? const Color(0xFFCBD5E1) : textSecondary,
      ),
      leadingAndTrailingTextStyle: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: isDark ? const Color(0xFF94A3B8) : textSecondary,
      ),
      iconColor: isDark ? const Color(0xFF94A3B8) : textSecondary,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }

  static SwitchThemeData _buildSwitchTheme({bool isDark = false}) {
    return SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return Colors.white;
        }
        return isDark ? const Color(0xFF64748B) : const Color(0xFFF1F5F9);
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryColor;
        }
        return isDark ? const Color(0xFF475569) : borderColor;
      }),
    );
  }

  static CheckboxThemeData _buildCheckboxTheme({bool isDark = false}) {
    return CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryColor;
        }
        return Colors.transparent;
      }),
      checkColor: WidgetStateProperty.all(Colors.white),
      side: const BorderSide(color: borderColor, width: 2),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }

  static RadioThemeData _buildRadioTheme({bool isDark = false}) {
    return RadioThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryColor;
        }
        return isDark ? const Color(0xFF64748B) : borderColor;
      }),
    );
  }

  static SliderThemeData _buildSliderTheme({bool isDark = false}) {
    return SliderThemeData(
      activeTrackColor: primaryColor,
      inactiveTrackColor: isDark ? const Color(0xFF475569) : borderColor,
      thumbColor: primaryColor,
      overlayColor: primaryColor.withOpacity(0.12),
      valueIndicatorColor: primaryColor,
      valueIndicatorTextStyle: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: Colors.white,
      ),
    );
  }

  static ProgressIndicatorThemeData _buildProgressIndicatorTheme({bool isDark = false}) {
    return const ProgressIndicatorThemeData(
      color: primaryColor,
      linearTrackColor: borderColor,
      circularTrackColor: borderColor,
    );
  }
}
