import 'package:flutter/material.dart';
import 'animated_loading_indicator.dart';

/// Loading overlay that can be shown over any screen
class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final String? message;
  final Color? backgroundColor;
  final LoadingAnimationType animationType;
  final Color? indicatorColor;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
    this.message,
    this.backgroundColor,
    this.animationType = LoadingAnimationType.ripple,
    this.indicatorColor,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: backgroundColor ?? Colors.black.withValues(alpha: 0.5),
            child: Center(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedLoadingIndicator(
                      size: 60,
                      color: indicatorColor ?? Theme.of(context).primaryColor,
                      type: animationType,
                    ),
                    if (message != null) ...[
                      const SizedBox(height: 16),
                      Text(
                        message!,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              fontWeight: FontWeight.w500,
                            ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

/// Loading button that shows loading state
class LoadingButton extends StatelessWidget {
  final bool isLoading;
  final VoidCallback? onPressed;
  final Widget child;
  final String? loadingText;
  final ButtonStyle? style;
  final LoadingAnimationType animationType;

  const LoadingButton({
    super.key,
    required this.isLoading,
    required this.onPressed,
    required this.child,
    this.loadingText,
    this.style,
    this.animationType = LoadingAnimationType.dots,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: style,
      child: isLoading
          ? Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedLoadingIndicator(
                  size: 20,
                  color: Colors.white,
                  type: animationType,
                ),
                if (loadingText != null) ...[
                  const SizedBox(width: 12),
                  Text(loadingText!),
                ],
              ],
            )
          : child,
    );
  }
}

/// Loading card for list items
class LoadingCard extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final double? height;
  final EdgeInsetsGeometry? margin;
  final EdgeInsetsGeometry? padding;

  const LoadingCard({
    super.key,
    required this.isLoading,
    required this.child,
    this.height,
    this.margin,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: margin ?? const EdgeInsets.all(8),
      child: Container(
        height: height,
        padding: padding ?? const EdgeInsets.all(16),
        child: isLoading
            ? const Center(
                child: AnimatedLoadingIndicator(
                  size: 30,
                  type: LoadingAnimationType.pulse,
                ),
              )
            : child,
      ),
    );
  }
}

/// Loading list view with shimmer effect
class LoadingListView extends StatelessWidget {
  final bool isLoading;
  final List<Widget> children;
  final Widget Function(BuildContext, int)? shimmerBuilder;
  final int shimmerItemCount;
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;

  const LoadingListView({
    super.key,
    required this.isLoading,
    required this.children,
    this.shimmerBuilder,
    this.shimmerItemCount = 5,
    this.physics,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return ListView.builder(
        physics: physics,
        padding: padding,
        itemCount: shimmerItemCount,
        itemBuilder: shimmerBuilder ?? _defaultShimmerBuilder,
      );
    }

    return ListView(
      physics: physics,
      padding: padding,
      children: children,
    );
  }

  Widget _defaultShimmerBuilder(BuildContext context, int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      height: 80,
      decoration: BoxDecoration(
        color: Colors.grey.shade300,
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }
}

/// Full screen loading widget
class FullScreenLoading extends StatelessWidget {
  final String? message;
  final LoadingAnimationType animationType;
  final Color? backgroundColor;

  const FullScreenLoading({
    super.key,
    this.message,
    this.animationType = LoadingAnimationType.ripple,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          backgroundColor ?? Theme.of(context).scaffoldBackgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedLoadingIndicator(
              size: 80,
              color: Theme.of(context).primaryColor,
              type: animationType,
            ),
            if (message != null) ...[
              const SizedBox(height: 24),
              Text(
                message!,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                textAlign: TextAlign.center,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
