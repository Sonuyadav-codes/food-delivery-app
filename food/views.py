from django.shortcuts import render
from .models import Food, Order


def home(request):
    selected_category = request.GET.get('category', 'all')

    if selected_category == 'all':
        foods = Food.objects.all()
    else:
        foods = Food.objects.filter(category__iexact=selected_category)

    return render(request, 'home.html', {
        'foods': foods,
        'selected_category': selected_category
    })


def checkout(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        total_amount = request.POST.get('total_amount')

        Order.objects.create(
            customer_name=name,
            phone=phone,
            address=address,
            total_amount=total_amount
        )

        return render(request, 'success.html')

    return render(request, 'checkout.html')